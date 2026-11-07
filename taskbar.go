//go:build windows

package main

import (
	"syscall"
	"unsafe"

	"golang.org/x/sys/windows"
)

// Taskbar button progress (like a render in Premiere): ITaskbarList3 through raw COM vtable calls.

var (
	ole32               = windows.NewLazySystemDLL("ole32.dll")
	pCoCreateInstance   = ole32.NewProc("CoCreateInstance")
	clsidTaskbarList    = windows.GUID{Data1: 0x56FDF344, Data2: 0xFD6D, Data3: 0x11d0, Data4: [8]byte{0x95, 0x8A, 0x00, 0x60, 0x97, 0xC9, 0xA0, 0x90}}
	iidITaskbarList3    = windows.GUID{Data1: 0xEA1AFB91, Data2: 0x9E28, Data3: 0x4B86, Data4: [8]byte{0x90, 0xE9, 0x9E, 0x9F, 0x8A, 0x5E, 0xEF, 0xAF}}
	taskbarList         uintptr
	taskbarFailed       bool
	lastProgressState   = -1
	lastProgressPermill = -1
)

const (
	tbpfNoProgress = 0
	tbpfNormal     = 0x2
	tbpfPaused     = 0x8
	vtHrInit       = 3
	vtSetValue     = 9
	vtSetState     = 10
)

func comCall(obj uintptr, index int, args ...uintptr) uintptr {
	vtbl := *(*uintptr)(unsafe.Pointer(obj))
	fn := *(*uintptr)(unsafe.Pointer(vtbl + uintptr(index)*unsafe.Sizeof(uintptr(0))))
	r, _, _ := syscall.SyscallN(fn, append([]uintptr{obj}, args...)...)
	return r
}

func taskbar() uintptr {
	if taskbarList != 0 || taskbarFailed {
		return taskbarList
	}
	_ = windows.CoInitializeEx(0, windows.COINIT_APARTMENTTHREADED)
	var obj uintptr
	r, _, _ := pCoCreateInstance.Call(
		uintptr(unsafe.Pointer(&clsidTaskbarList)), 0, 1|4, // CLSCTX_INPROC_SERVER | CLSCTX_LOCAL_SERVER
		uintptr(unsafe.Pointer(&iidITaskbarList3)), uintptr(unsafe.Pointer(&obj)))
	if r != 0 || obj == 0 {
		taskbarFailed = true
		logf("taskbar progress unavailable: %#x", r)
		return 0
	}
	comCall(obj, vtHrInit)
	taskbarList = obj
	return obj
}

// setTaskbarProgress shows ratio (0..1) on the taskbar button; ratio < 0 clears it.
func setTaskbarProgress(ratio float64, paused bool) {
	state := tbpfNormal
	if ratio < 0 {
		state = tbpfNoProgress
	} else if paused {
		state = tbpfPaused
	}
	permill := int(ratio * 1000)
	if ratio < 0 {
		permill = -1
	}
	if state == lastProgressState && permill == lastProgressPermill {
		return
	}
	tb := taskbar()
	if tb == 0 {
		return
	}
	if state != lastProgressState {
		comCall(tb, vtSetState, mainHwnd, uintptr(state))
	}
	if state != tbpfNoProgress {
		if permill < 1 {
			permill = 1
		}
		comCall(tb, vtSetValue, mainHwnd, uintptr(permill), 1000)
	}
	lastProgressState, lastProgressPermill = state, permill
}

// The taskbar button is recreated when Explorer restarts or the window is shown again;
// forget the cached state so the next update is re-sent.
func resetTaskbarProgress() { lastProgressState, lastProgressPermill = -1, -1 }
