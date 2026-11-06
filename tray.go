//go:build windows

package main

import (
	"unsafe"

	"golang.org/x/sys/windows"
)

type trayLabels struct {
	Open  string `json:"open"`
	Start string `json:"start"`
	Pause string `json:"pause"`
	Test  string `json:"test"`
	Quit  string `json:"quit"`
}

type trayState struct {
	Running bool       `json:"running"`
	Tooltip string     `json:"tooltip"`
	Labels  trayLabels `json:"labels"`
}

var (
	tray      = trayState{Tooltip: AppName, Labels: trayLabels{Open: "Открыть " + AppName, Start: "Старт", Pause: "Пауза", Test: "Тест напоминания (5 сек)", Quit: "Выйти"}}
	trayAdded bool
)

const (
	cmdOpen = 1 + iota
	cmdToggle
	cmdTest
	cmdQuit
)

func trayData() notifyIconData {
	icon, _, _ := pLoadImageW.Call(moduleHandle(), iconID, imageIcon, 16*uintptr(dpiFor(0)), 16*uintptr(dpiFor(0)), lrShared)
	if icon == 0 {
		icon, _, _ = pLoadImageW.Call(moduleHandle(), iconID, imageIcon, 0, 0, lrDefaultSize|lrShared)
	}
	nid := notifyIconData{
		Wnd:             mainHwnd,
		ID:              1,
		Flags:           nifMessage | nifIcon | nifTip | nifShowTip,
		CallbackMessage: wmAppTray,
		Icon:            icon,
		Version:         4, // NOTIFYICON_VERSION_4
	}
	nid.Size = uint32(unsafe.Sizeof(nid))
	tip, _ := windows.UTF16FromString(tray.Tooltip)
	if len(tip) > 127 {
		tip = append(tip[:127], 0)
	}
	copy(nid.Tip[:], tip)
	return nid
}

func addTray() {
	nid := trayData()
	pShellNotifyIconW.Call(nimAdd, uintptr(unsafe.Pointer(&nid)))
	pShellNotifyIconW.Call(nimSetVersion, uintptr(unsafe.Pointer(&nid)))
	trayAdded = true
}

func removeTray() {
	if !trayAdded {
		return
	}
	nid := trayData()
	pShellNotifyIconW.Call(nimDelete, uintptr(unsafe.Pointer(&nid)))
	trayAdded = false
}

func updateTray(st trayState) {
	tooltipChanged := st.Tooltip != tray.Tooltip
	if st.Labels.Open == "" {
		st.Labels = tray.Labels
	}
	tray = st
	if trayAdded && tooltipChanged {
		nid := trayData()
		pShellNotifyIconW.Call(nimModify, uintptr(unsafe.Pointer(&nid)))
	}
}

func onTrayEvent(ev uint32) {
	switch ev {
	case wmLButtonUp:
		toggleMain()
	case wmRButtonUp, wmContextMenu:
		showTrayMenu()
	}
}

func showTrayMenu() {
	m, _, _ := pCreatePopupMenu.Call()
	add := func(id int, label string) {
		pAppendMenuW.Call(m, mfString, uintptr(id), uintptr(unsafe.Pointer(u16(label))))
	}
	add(cmdOpen, tray.Labels.Open)
	if tray.Running {
		add(cmdToggle, tray.Labels.Pause)
	} else {
		add(cmdToggle, tray.Labels.Start)
	}
	add(cmdTest, tray.Labels.Test)
	pAppendMenuW.Call(m, mfSeparator, 0, 0)
	add(cmdQuit, tray.Labels.Quit)

	p := cursorPos()
	pSetForegroundWindow.Call(mainHwnd)
	cmd, _, _ := pTrackPopupMenu.Call(m, tpmReturnCmd|tpmRightButton|tpmBottomAlign, uintptr(p.X), uintptr(p.Y), 0, mainHwnd, 0)
	pDestroyMenu.Call(m)
	pPostMessageW.Call(mainHwnd, 0, 0, 0) // WM_NULL, per the docs, so the menu closes properly

	switch int(cmd) {
	case cmdOpen:
		showMain()
	case cmdToggle:
		emit("tray-action", "toggle")
	case cmdTest:
		emit("tray-action", "test")
	case cmdQuit:
		quitApp()
	}
}
