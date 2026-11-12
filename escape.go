//go:build windows

package main

import (
	"os"
	"path/filepath"
	"syscall"
	"time"
	"unsafe"

	"golang.org/x/sys/windows"
)

/*
Started from another program (Яйца Cloud's "Open", a link inside its window, a launcher) the
timer can end up in that program's job object, set to kill every process in it when the job
closes. Then closing that program closed the timer too, unsaved and mid-session. So at start,
before anything else, the timer checks: if it sits in a job that kills on close, it starts a copy
of itself outside the job (breaking away when the job allows, otherwise through Explorer) and
quits at once. A marker file stops this from ever looping.
*/

func inKillingJob() bool {
	var info windows.JOBOBJECT_EXTENDED_LIMIT_INFORMATION
	// a zero handle asks about the job of this very process; it fails when there is none
	err := windows.QueryInformationJobObject(0, windows.JobObjectExtendedLimitInformation,
		uintptr(unsafe.Pointer(&info)), uint32(unsafe.Sizeof(info)), nil)
	return err == nil && info.BasicLimitInformation.LimitFlags&windows.JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE != 0
}

func escapeMarker() string { return filepath.Join(dataDir(), "relaunch.tmp") }

// escapeJob returns true when a free copy was started and this one should quit now.
func escapeJob() bool {
	if !inKillingJob() {
		_ = os.Remove(escapeMarker())
		return false
	}
	// just relaunched and still in a killing job (the whole session runs in one): live with it
	if st, err := os.Stat(escapeMarker()); err == nil && time.Since(st.ModTime()) < 30*time.Second {
		_ = os.Remove(escapeMarker())
		logf("in a job that kills on close; staying (already relaunched once)")
		return false
	}
	exe, err := os.Executable()
	if err != nil {
		return false
	}
	_ = os.MkdirAll(dataDir(), 0o755)
	_ = os.WriteFile(escapeMarker(), []byte(time.Now().Format(time.RFC3339)), 0o644)
	// 1) break away from the job, keeping the arguments
	args := syscall.EscapeArg(exe)
	for _, a := range os.Args[1:] {
		args += " " + syscall.EscapeArg(a)
	}
	cmd, _ := windows.UTF16PtrFromString(args)
	var si windows.StartupInfo
	si.Cb = uint32(unsafe.Sizeof(si))
	var pi windows.ProcessInformation
	if windows.CreateProcess(nil, cmd, nil, nil, false, windows.CREATE_BREAKAWAY_FROM_JOB, nil, nil, &si, &pi) == nil {
		windows.CloseHandle(pi.Thread)
		windows.CloseHandle(pi.Process)
		logf("started from a program that would close it on exit; relaunched on its own")
		return true
	}
	// 2) the job does not allow it: Explorer starts it (Explorer is outside any app's job)
	dir, _ := windows.GetWindowsDirectory()
	explorer := filepath.Join(dir, "explorer.exe")
	cmd2, _ := windows.UTF16PtrFromString(syscall.EscapeArg(explorer) + " " + syscall.EscapeArg(exe))
	var si2 windows.StartupInfo
	si2.Cb = uint32(unsafe.Sizeof(si2))
	var pi2 windows.ProcessInformation
	if windows.CreateProcess(nil, cmd2, nil, nil, false, 0, nil, nil, &si2, &pi2) == nil {
		windows.CloseHandle(pi2.Thread)
		windows.CloseHandle(pi2.Process)
		logf("started from a program that would close it on exit; relaunched through Explorer")
		return true
	}
	_ = os.Remove(escapeMarker())
	return false
}
