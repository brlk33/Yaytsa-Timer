//go:build windows

package main

import (
	"syscall"
	"unsafe"

	"golang.org/x/sys/windows"
)

var (
	user32   = windows.NewLazySystemDLL("user32.dll")
	kernel32 = windows.NewLazySystemDLL("kernel32.dll")
	gdi32    = windows.NewLazySystemDLL("gdi32.dll")
	shell32  = windows.NewLazySystemDLL("shell32.dll")
	dwmapi   = windows.NewLazySystemDLL("dwmapi.dll")

	pRegisterClassExW              = user32.NewProc("RegisterClassExW")
	pCreateWindowExW               = user32.NewProc("CreateWindowExW")
	pDefWindowProcW                = user32.NewProc("DefWindowProcW")
	pDestroyWindow                 = user32.NewProc("DestroyWindow")
	pShowWindow                    = user32.NewProc("ShowWindow")
	pIsWindowVisible               = user32.NewProc("IsWindowVisible")
	pIsIconic                      = user32.NewProc("IsIconic")
	pSetForegroundWindow           = user32.NewProc("SetForegroundWindow")
	pGetMessageW                   = user32.NewProc("GetMessageW")
	pTranslateMessage              = user32.NewProc("TranslateMessage")
	pDispatchMessageW              = user32.NewProc("DispatchMessageW")
	pPostMessageW                  = user32.NewProc("PostMessageW")
	pPostQuitMessage               = user32.NewProc("PostQuitMessage")
	pSetWindowTextW                = user32.NewProc("SetWindowTextW")
	pSetWindowPos                  = user32.NewProc("SetWindowPos")
	pGetWindowRect                 = user32.NewProc("GetWindowRect")
	pLoadImageW                    = user32.NewProc("LoadImageW")
	pLoadCursorW                   = user32.NewProc("LoadCursorW")
	pFindWindowW                   = user32.NewProc("FindWindowW")
	pSetTimer                      = user32.NewProc("SetTimer")
	pKillTimer                     = user32.NewProc("KillTimer")
	pGetCursorPos                  = user32.NewProc("GetCursorPos")
	pMonitorFromPoint              = user32.NewProc("MonitorFromPoint")
	pMonitorFromRect               = user32.NewProc("MonitorFromRect")
	pMonitorFromWindow             = user32.NewProc("MonitorFromWindow")
	pGetMonitorInfoW               = user32.NewProc("GetMonitorInfoW")
	pGetDpiForWindow               = user32.NewProc("GetDpiForWindow")
	pGetDpiForSystem               = user32.NewProc("GetDpiForSystem")
	pSetProcessDpiAwarenessContext = user32.NewProc("SetProcessDpiAwarenessContext")
	pCreatePopupMenu               = user32.NewProc("CreatePopupMenu")
	pAppendMenuW                   = user32.NewProc("AppendMenuW")
	pTrackPopupMenu                = user32.NewProc("TrackPopupMenu")
	pDestroyMenu                   = user32.NewProc("DestroyMenu")
	pRegisterWindowMessageW        = user32.NewProc("RegisterWindowMessageW")
	pFlashWindowEx                 = user32.NewProc("FlashWindowEx")
	pMessageBoxW                   = user32.NewProc("MessageBoxW")
	pSetClassLongPtrW              = user32.NewProc("SetClassLongPtrW")
	pInvalidateRect                = user32.NewProc("InvalidateRect")

	pGetModuleHandleW = kernel32.NewProc("GetModuleHandleW")
	pCreateMutexW     = kernel32.NewProc("CreateMutexW")

	pCreateSolidBrush = gdi32.NewProc("CreateSolidBrush")
	pDeleteObject     = gdi32.NewProc("DeleteObject")

	pShellNotifyIconW = shell32.NewProc("Shell_NotifyIconW")
	pShellExecuteW    = shell32.NewProc("ShellExecuteW")

	pDwmSetWindowAttribute = dwmapi.NewProc("DwmSetWindowAttribute")
)

const (
	wmDestroy         = 0x0002
	wmMove            = 0x0003
	wmSize            = 0x0005
	wmActivate        = 0x0006
	wmClose           = 0x0010
	wmQuit            = 0x0012
	wmGetMinMaxInfo   = 0x0024
	wmSettingChange   = 0x001A
	wmTimer           = 0x0113
	wmExitSizeMove    = 0x0232
	wmDpiChanged      = 0x02E0
	wmLButtonUp       = 0x0202
	wmRButtonUp       = 0x0205
	wmContextMenu     = 0x007B
	wmApp             = 0x8000
	wmAppTray         = wmApp + 1
	wmAppShow         = wmApp + 2
	wmAppDispatch     = wmApp + 3
	wmAppQuit         = wmApp + 9 // the installer asks a running copy to save and exit (0x8009)
	wsOverlappedWin   = 0x00CF0000
	wsPopup           = 0x80000000
	wsExTopmost       = 0x00000008
	wsExToolWindow    = 0x00000080
	swHide            = 0
	swShow            = 5
	swShowNoActivate  = 4
	swRestore         = 9
	swpNoSize         = 0x0001
	swpNoMove         = 0x0002
	swpNoZOrder       = 0x0004
	swpNoActivate     = 0x0010
	swpShowWindow     = 0x0040
	cwUseDefault      = 0x80000000
	hwndTopmost       = ^uintptr(0) // -1
	hwndNoTopmost     = ^uintptr(1) // -2
	imageIcon         = 1
	lrDefaultSize     = 0x0040
	lrShared          = 0x8000
	idcArrow          = 32512
	monitorNearest    = 2
	monitorNull       = 0
	mfString          = 0x0000
	mfSeparator       = 0x0800
	tpmReturnCmd      = 0x0100
	tpmRightButton    = 0x0002
	tpmBottomAlign    = 0x0020
	nimAdd            = 0
	nimModify         = 1
	nimDelete         = 2
	nimSetVersion     = 4
	nifMessage        = 0x01
	nifIcon           = 0x02
	nifTip            = 0x04
	nifShowTip        = 0x80
	gclpHbrBackground = -10
	waInactive        = 0
)

type point struct{ X, Y int32 }
type rect struct{ Left, Top, Right, Bottom int32 }

type msgT struct {
	Hwnd    uintptr
	Message uint32
	WParam  uintptr
	LParam  uintptr
	Time    uint32
	Pt      point
	Private uint32
}

type wndClassExW struct {
	Size       uint32
	Style      uint32
	WndProc    uintptr
	ClsExtra   int32
	WndExtra   int32
	Instance   uintptr
	Icon       uintptr
	Cursor     uintptr
	Background uintptr
	MenuName   *uint16
	ClassName  *uint16
	IconSm     uintptr
}

type monitorInfo struct {
	Size    uint32
	Monitor rect
	Work    rect
	Flags   uint32
}

type minMaxInfo struct {
	Reserved, MaxSize, MaxPosition, MinTrackSize, MaxTrackSize point
}

type notifyIconData struct {
	Size            uint32
	Wnd             uintptr
	ID              uint32
	Flags           uint32
	CallbackMessage uint32
	Icon            uintptr
	Tip             [128]uint16
	State           uint32
	StateMask       uint32
	Info            [256]uint16
	Version         uint32
	InfoTitle       [64]uint16
	InfoFlags       uint32
	GUIDItem        windows.GUID
	BalloonIcon     uintptr
}

type flashWInfo struct {
	Size    uint32
	Hwnd    uintptr
	Flags   uint32
	Count   uint32
	Timeout uint32
}

func u16(s string) *uint16 { p, _ := windows.UTF16PtrFromString(s); return p }

func moduleHandle() uintptr { h, _, _ := pGetModuleHandleW.Call(0); return h }

func showWindow(h uintptr, cmd int) { pShowWindow.Call(h, uintptr(cmd)) }

func isVisible(h uintptr) bool { r, _, _ := pIsWindowVisible.Call(h); return r != 0 }

func isIconic(h uintptr) bool { r, _, _ := pIsIconic.Call(h); return r != 0 }

func setTitle(h uintptr, s string) { pSetWindowTextW.Call(h, uintptr(unsafe.Pointer(u16(s)))) }

func setWindowPos(h, after uintptr, x, y, w, hh int32, flags uint32) {
	pSetWindowPos.Call(h, after, uintptr(x), uintptr(y), uintptr(w), uintptr(hh), uintptr(flags))
}

func windowRect(h uintptr) rect {
	var r rect
	pGetWindowRect.Call(h, uintptr(unsafe.Pointer(&r)))
	return r
}

func dpiFor(h uintptr) float64 {
	var d uintptr
	if h != 0 && pGetDpiForWindow.Find() == nil {
		d, _, _ = pGetDpiForWindow.Call(h)
	}
	if d == 0 && pGetDpiForSystem.Find() == nil {
		d, _, _ = pGetDpiForSystem.Call()
	}
	if d == 0 {
		d = 96
	}
	return float64(d) / 96
}

func workAreaAt(p point) rect {
	m, _, _ := pMonitorFromPoint.Call(uintptr(*(*uint64)(unsafe.Pointer(&p))), monitorNearest)
	mi := monitorInfo{Size: uint32(unsafe.Sizeof(monitorInfo{}))}
	pGetMonitorInfoW.Call(m, uintptr(unsafe.Pointer(&mi)))
	return mi.Work
}

func cursorPos() point {
	var p point
	pGetCursorPos.Call(uintptr(unsafe.Pointer(&p)))
	return p
}

func rectOnScreen(r rect) bool {
	m, _, _ := pMonitorFromRect.Call(uintptr(unsafe.Pointer(&r)), monitorNull)
	return m != 0
}

func dwmSet(h uintptr, attr uint32, val uint32) {
	if pDwmSetWindowAttribute.Find() != nil {
		return
	}
	v := val
	pDwmSetWindowAttribute.Call(h, uintptr(attr), uintptr(unsafe.Pointer(&v)), 4)
}

// colorref from 0xRRGGBB
func colorref(rgb uint32) uint32 {
	return (rgb>>16)&0xFF | (rgb & 0xFF00) | (rgb&0xFF)<<16
}

func shellOpen(file, args string) {
	var a uintptr
	if args != "" {
		a = uintptr(unsafe.Pointer(u16(args)))
	}
	pShellExecuteW.Call(0, uintptr(unsafe.Pointer(u16("open"))), uintptr(unsafe.Pointer(u16(file))), a, 0, 1)
}

func messageBox(text, title string, flags uint32) int {
	r, _, _ := pMessageBoxW.Call(0, uintptr(unsafe.Pointer(u16(text))), uintptr(unsafe.Pointer(u16(title))), uintptr(flags))
	return int(r)
}

func flashWindow(h uintptr, on bool) {
	fi := flashWInfo{Size: uint32(unsafe.Sizeof(flashWInfo{})), Hwnd: h}
	if on {
		fi.Flags = 0x3 | 0xC // FLASHW_ALL | FLASHW_TIMERNOFG
	}
	pFlashWindowEx.Call(uintptr(unsafe.Pointer(&fi)))
}

var _ = syscall.Errno(0)
