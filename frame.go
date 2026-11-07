//go:build windows

package main

import (
	"math"
	"unsafe"
)

/*
Custom title bar: the page draws the title, icon and window buttons. Windows keeps the
resize borders, shadow, rounded corners, snapping and the minimize/maximize animations;
only the caption strip is removed from the non-client area (WM_NCCALCSIZE).
*/

var (
	pReleaseCapture         = user32.NewProc("ReleaseCapture")
	pIsZoomed               = user32.NewProc("IsZoomed")
	pGetSystemMetricsForDpi = user32.NewProc("GetSystemMetricsForDpi")
	pGetSystemMetrics       = user32.NewProc("GetSystemMetrics")
	lastMaximized           = -1
)

const (
	wmNcCalcSize    = 0x0083
	wmNcLButtonDown = 0x00A1
	htCaption       = 2
	swMinimize      = 6
	swMaximize      = 3
	swpFrameChanged = 0x0020
)

type ncCalcSizeParams struct {
	Rgrc  [3]rect
	Lppos uintptr
}

func isZoomed(h uintptr) bool { r, _, _ := pIsZoomed.Call(h); return r != 0 }

func sysMetric(idx int, dpi uint32) int32 {
	if pGetSystemMetricsForDpi.Find() == nil {
		r, _, _ := pGetSystemMetricsForDpi.Call(uintptr(idx), uintptr(dpi))
		return int32(r)
	}
	r, _, _ := pGetSystemMetrics.Call(uintptr(idx))
	return int32(r)
}

// onNcCalcSize removes the caption but keeps the side and bottom resize frame.
func onNcCalcSize(hwnd, wp, lp uintptr) (uintptr, bool) {
	if wp == 0 {
		return 0, false
	}
	p := (*ncCalcSizeParams)(unsafe.Pointer(lp))
	top := p.Rgrc[0].Top
	pDefWindowProcW.Call(hwnd, wmNcCalcSize, wp, lp)
	p.Rgrc[0].Top = top
	if isZoomed(hwnd) {
		// A maximized window hangs over the monitor edge by its frame: keep the page on screen.
		dpi := uint32(dpiFor(hwnd) * 96)
		p.Rgrc[0].Top += sysMetric(33, dpi) + sysMetric(92, dpi) // SM_CYFRAME + SM_CXPADDEDBORDER
	}
	return 0, true
}

func refreshFrame(h uintptr) {
	setWindowPos(h, 0, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoZOrder|swpNoActivate|swpFrameChanged)
}

// startNcDrag hands a mouse press on the page's title bar (or top edge) to Windows,
// which then runs its own move/resize loop.
func startNcDrag(hit int) {
	if hit <= 0 {
		hit = htCaption
	}
	pReleaseCapture.Call()
	pPostMessageW.Call(mainHwnd, wmNcLButtonDown, uintptr(hit), 0)
}

func toggleMaximize() {
	if isZoomed(mainHwnd) {
		showWindow(mainHwnd, swRestore)
	} else {
		showWindow(mainHwnd, swMaximize)
	}
}

func notifyMaximized() {
	m := 0
	if isZoomed(mainHwnd) {
		m = 1
	}
	if m != lastMaximized {
		lastMaximized = m
		emit("maximized", m == 1)
	}
}

// setZoom scales the page through WebView2 itself, so CSS px, media queries and
// viewport units all follow the zoom (ICoreWebView2Controller::put_ZoomFactor, slot 8).
func setZoom(z float64) {
	if mainWeb == nil || mainWeb.GetController() == nil || z <= 0 {
		return
	}
	comCall(uintptr(unsafe.Pointer(mainWeb.GetController())), 8, uintptr(math.Float64bits(z)))
}
