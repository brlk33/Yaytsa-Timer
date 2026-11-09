//go:build windows

package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
	"unsafe"

	"github.com/jchv/go-webview2/pkg/edge"
	"golang.org/x/sys/windows"
	"golang.org/x/sys/windows/registry"
)

const (
	Version     = "2.13.0"
	AppName     = "Яйцетаймер"
	mainClass   = "YaytsaTimerMain"
	alertClass  = "YaytsaTimerAlert"
	iconID      = 1
	alertW      = 380
	alertH      = 150
	timerTop    = 1
	timerQuit   = 2
	timerPhase  = 3
	debugEnvVar = "YAYTSA_DEBUG"
)

var (
	mainHwnd, alertHwnd uintptr
	mainWeb, alertWeb   *edge.Chromium
	alertReady          bool
	alertCreating       bool
	pendingAlert        string
	quitting            bool
	theme               = "dark"
	closeToTray         = true
	dispatchMu          sync.Mutex
	dispatchQ           []func()
	bgBrush             uintptr
	taskbarCreatedMsg   uint32
	logMu               sync.Mutex
)

/* ---------------- paths, log, data ---------------- */

func dataDir() string {
	d, err := os.UserConfigDir() // %APPDATA%
	if err != nil {
		d = os.TempDir()
	}
	d = filepath.Join(d, "YaytsaTimer")
	os.MkdirAll(d, 0o755)
	return d
}

func webDataDir() string {
	d, err := os.UserCacheDir() // %LOCALAPPDATA%
	if err != nil {
		d = os.TempDir()
	}
	return filepath.Join(d, "YaytsaTimer", "WebView2")
}

func logf(format string, a ...any) {
	logMu.Lock()
	defer logMu.Unlock()
	f, err := os.OpenFile(filepath.Join(dataDir(), "yaytsa-timer.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()
	fmt.Fprintf(f, "[%s] %s\n", time.Now().Format(time.RFC3339), fmt.Sprintf(format, a...))
}

func dataFile() string { return filepath.Join(dataDir(), "data.json") }

func readData() map[string]json.RawMessage {
	m := map[string]json.RawMessage{}
	b, err := os.ReadFile(dataFile())
	if err != nil || json.Unmarshal(b, &m) != nil {
		if b2, err2 := os.ReadFile(dataFile() + ".bak"); err2 == nil {
			_ = json.Unmarshal(b2, &m)
		}
	}
	return m
}

func writeData(m map[string]json.RawMessage) {
	b, err := json.MarshalIndent(m, "", " ")
	if err != nil {
		return
	}
	tmp := dataFile() + ".tmp"
	if os.WriteFile(tmp, b, 0o644) != nil {
		return
	}
	if old, err := os.ReadFile(dataFile()); err == nil {
		_ = os.WriteFile(dataFile()+".bak", old, 0o644)
	}
	_ = os.Rename(tmp, dataFile())
}

func mergeData(partial map[string]json.RawMessage) {
	m := readData()
	for k, v := range partial {
		m[k] = v
	}
	writeData(m)
}

// Migrate history from the first build ("Focus") if this is a fresh install.
func migrate() {
	if _, err := os.Stat(dataFile()); err == nil {
		return
	}
	cfg, _ := os.UserConfigDir()
	if b, err := os.ReadFile(filepath.Join(cfg, "Focus", "data.json")); err == nil {
		_ = os.WriteFile(dataFile(), b, 0o644)
	}
}

/* ---------------- dispatch to UI thread ---------------- */

func dispatch(f func()) {
	dispatchMu.Lock()
	dispatchQ = append(dispatchQ, f)
	dispatchMu.Unlock()
	pPostMessageW.Call(mainHwnd, wmAppDispatch, 0, 0)
}

func runDispatch() {
	dispatchMu.Lock()
	q := dispatchQ
	dispatchQ = nil
	dispatchMu.Unlock()
	for _, f := range q {
		f()
	}
}

/* ---------------- theme ---------------- */

func systemDark() bool {
	k, err := registry.OpenKey(registry.CURRENT_USER, `Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`, registry.QUERY_VALUE)
	if err != nil {
		return true
	}
	defer k.Close()
	v, _, err := k.GetIntegerValue("AppsUseLightTheme")
	if err != nil {
		return true
	}
	return v == 0
}

func resolvedTheme() string {
	if theme == "system" {
		if systemDark() {
			return "dark"
		}
		return "light"
	}
	if theme == "light" {
		return "light"
	}
	return "dark"
}

type palette struct{ bg, text, border uint32 }

func pal() palette {
	if resolvedTheme() == "light" {
		return palette{bg: 0xFFFFFF, text: 0x37352F, border: 0xE9E9E7}
	}
	return palette{bg: 0x191919, text: 0xD4D4D4, border: 0x2F2F2F}
}

func applyWindowTheme(h uintptr, alert bool) {
	p := pal()
	dark := uint32(0)
	if resolvedTheme() == "dark" {
		dark = 1
	}
	dwmSet(h, 20, dark) // DWMWA_USE_IMMERSIVE_DARK_MODE
	if alert {
		bg := uint32(0x202020)
		if dark == 0 {
			bg = 0xFFFFFF
		}
		dwmSet(h, 33, 2)                  // rounded corners (Win11)
		dwmSet(h, 34, colorref(p.border)) // border
		_ = bg
	} else {
		dwmSet(h, 35, colorref(p.bg))   // caption
		dwmSet(h, 36, colorref(p.text)) // caption text
		dwmSet(h, 34, colorref(p.bg))   // border
	}
}

func setWebBackground(c *edge.Chromium, rgb uint32) {
	if c == nil || c.GetController() == nil {
		return
	}
	if c2 := c.GetController().GetICoreWebView2Controller2(); c2 != nil {
		_ = c2.PutDefaultBackgroundColor(edge.COREWEBVIEW2_COLOR{A: 255, R: uint8(rgb >> 16), G: uint8(rgb >> 8), B: uint8(rgb)})
	}
}

func applyTheme() {
	p := pal()
	if bgBrush != 0 {
		pDeleteObject.Call(bgBrush)
	}
	bgBrush, _, _ = pCreateSolidBrush.Call(uintptr(colorref(p.bg)))
	if mainHwnd != 0 {
		pSetClassLongPtrW.Call(mainHwnd, ^uintptr(9), bgBrush)
		applyWindowTheme(mainHwnd, false)
		setWebBackground(mainWeb, p.bg)
		// force non-client repaint so the caption color updates
		setWindowPos(mainHwnd, 0, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoZOrder|swpNoActivate|0x20)
	}
	if alertHwnd != 0 {
		applyWindowTheme(alertHwnd, true)
		if resolvedTheme() == "light" {
			setWebBackground(alertWeb, 0xFFFFFF)
		} else {
			setWebBackground(alertWeb, 0x202020)
		}
	}
}

/* ---------------- web content ---------------- */

func newWeb(hwnd uintptr, bg uint32, onMsg func(string)) (*edge.Chromium, bool) {
	c := edge.NewChromium()
	c.DataPath = webDataDir()
	c.MessageCallback = onMsg
	if !c.Embed(hwnd) {
		return nil, false
	}
	setWebBackground(c, bg)
	if s, err := c.GetSettings(); err == nil {
		debug := os.Getenv(debugEnvVar) != ""
		_ = s.PutAreDefaultContextMenusEnabled(debug)
		_ = s.PutAreDevToolsEnabled(debug)
		_ = s.PutIsStatusBarEnabled(false)
		_ = s.PutIsZoomControlEnabled(false)
		_ = s.PutIsPinchZoomEnabled(false)
		_ = s.PutIsSwipeNavigationEnabled(false)
		_ = s.PutAreBrowserAcceleratorKeysEnabled(debug)
	}
	c.NavigationCompletedCallback = func(*edge.ICoreWebView2, *edge.ICoreWebView2NavigationCompletedEventArgs) {
		if isVisible(hwnd) {
			wake(c)
		}
	}
	c.Resize()
	return c, true
}

// WebView2 created inside a hidden window may never paint: after showing the host,
// re-assert visibility and bounds.
func wake(c *edge.Chromium) {
	if c == nil || c.GetController() == nil {
		return
	}
	_ = c.Show()
	c.Resize()
	_ = c.NotifyParentWindowPositionChanged()
}

func sleepWeb(c *edge.Chromium) {
	if c != nil && c.GetController() != nil {
		_ = c.Hide()
	}
}

func jsonStr(v any) string { b, _ := json.Marshal(v); return string(b) }

func emit(name string, payload any) {
	if mainWeb != nil {
		mainWeb.Eval(fmt.Sprintf("window.__emit&&window.__emit(%s,%s)", jsonStr(name), jsonStr(payload)))
	}
}

/* ---------------- bridge: messages from the page ---------------- */

type rpc struct {
	ID   int               `json:"id"`
	Cmd  string            `json:"cmd"`
	Args []json.RawMessage `json:"args"`
}

func arg[T any](r rpc, i int) T {
	var v T
	if i < len(r.Args) {
		_ = json.Unmarshal(r.Args[i], &v)
	}
	return v
}

func onMainMessage(s string) {
	var r rpc
	if json.Unmarshal([]byte(s), &r) != nil || r.Cmd == "" {
		return // echo of our own message or garbage
	}
	var result any = true
	switch r.Cmd {
	case "load":
		result = readData()
	case "save":
		var partial map[string]json.RawMessage
		if len(r.Args) > 0 {
			_ = json.Unmarshal(r.Args[0], &partial)
		}
		if partial != nil {
			mergeData(partial)
			if raw, ok := partial["settings"]; ok {
				var st struct {
					CloseToTray *bool  `json:"closeToTray"`
					Theme       string `json:"theme"`
				}
				_ = json.Unmarshal(raw, &st)
				if st.CloseToTray != nil {
					closeToTray = *st.CloseToTray
				}
			}
		}
	case "flushed":
		finalQuit()
		return
	case "showAlert":
		showAlert(string(r.Args[0]))
	case "closeAlert":
		hideAlert()
	case "updateTray":
		var st trayState
		_ = json.Unmarshal(r.Args[0], &st)
		updateTray(st)
	case "quit":
		quitApp()
	case "log":
		logf("page: %s", arg[string](r, 0))
	case "installUpdate":
		installUpdate()
	case "title":
		setTitle(mainHwnd, arg[string](r, 0))
	case "theme":
		theme = arg[string](r, 0)
		applyTheme()
	case "systemDark":
		result = systemDark()
	case "alwaysOnTop":
		after := hwndNoTopmost
		if arg[bool](r, 0) {
			after = hwndTopmost
		}
		setWindowPos(mainHwnd, after, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoActivate)
	case "focusWindow":
		showMain()
	case "exportCsv":
		result = exportCsv(arg[string](r, 0), arg[string](r, 1))
	case "openDataFolder":
		shellOpen("explorer.exe", dataDir())
	case "authBrowser":
		startAuth(arg[string](r, 0), arg[string](r, 1))
	case "openUrl":
		if u := arg[string](r, 0); strings.HasPrefix(u, "https://") {
			shellOpen(u, "")
		}
	case "flash":
		if !isForeground() {
			flashWindow(mainHwnd, true)
		}
	case "version":
		result = Version
	case "autostart":
		result = autostartEnabled()
	case "setAutostart":
		result = setAutostart(arg[bool](r, 0))
	case "appsStats":
		result = appsStats()
	case "appsCandidates":
		result = withIcons(appCandidates())
	case "appsTrack":
		trackApp(arg[appInfo](r, 0))
		result = appsStats()
	case "appsUntrack":
		untrackApp(arg[string](r, 0))
		result = appsStats()
	case "appsInstalled":
		result = withIcons(installedApps())
	case "appsBrowse":
		// A modal dialog must not run inside the WebView2 event handler: open it from the queue.
		id, title := r.ID, arg[string](r, 0)
		dispatch(func() { reply(id, browseExe(title)) })
		return
	case "ncdrag":
		hit := arg[int](r, 0)
		dispatch(func() { startNcDrag(hit) })
	case "winMin":
		showWindow(mainHwnd, swMinimize)
	case "winMax":
		toggleMaximize()
	case "winClose":
		pPostMessageW.Call(mainHwnd, wmClose, 0, 0)
	case "isMaximized":
		result = isZoomed(mainHwnd)
	case "zoom":
		setZoom(arg[float64](r, 0))
	case "progress":
		setTaskbarProgress(arg[float64](r, 0), arg[bool](r, 1))
	case "schedule":
		// Phase end, in ms from now (0 = cancel). A native timer wakes the page even if
		// Chromium throttles its own timers while the window is hidden.
		pKillTimer.Call(mainHwnd, timerPhase)
		if ms := arg[float64](r, 0); ms > 0 {
			pSetTimer.Call(mainHwnd, timerPhase, uintptr(ms)+30, 0)
		}
	default:
		result = nil
	}
	reply(r.ID, result)
}

func reply(id int, result any) {
	if id > 0 && mainWeb != nil {
		mainWeb.Eval(fmt.Sprintf("window.__reply&&window.__reply(%d,%s)", id, jsonStr(result)))
	}
}

func isForeground() bool {
	r, _, _ := user32.NewProc("GetForegroundWindow").Call()
	return r == mainHwnd
}

func exportCsv(csv, name string) bool {
	dir, err := windows.KnownFolderPath(windows.FOLDERID_Documents, 0)
	if err != nil {
		dir = dataDir()
	}
	p := filepath.Join(dir, filepath.Base(name))
	if os.WriteFile(p, append([]byte("\xef\xbb\xbf"), []byte(csv)...), 0o644) != nil {
		return false
	}
	shellOpen("explorer.exe", `/select,"`+p+`"`)
	return true
}

/* ---------------- main window ---------------- */

func showMain() {
	if isIconic(mainHwnd) {
		showWindow(mainHwnd, swRestore)
	} else {
		showWindow(mainHwnd, swShow)
	}
	pSetForegroundWindow.Call(mainHwnd)
	resetTaskbarProgress() // the taskbar button was recreated: re-send progress on the next tick
	emit("window-visible", true)
	wake(mainWeb)
	if mainWeb != nil {
		mainWeb.Focus()
	}
}

func toggleMain() {
	if isVisible(mainHwnd) && !isIconic(mainHwnd) {
		saveBounds()
		// the page keeps running while hidden so the timer and reminders stay on time
		showWindow(mainHwnd, swHide)
		emit("window-visible", false)
	} else {
		showMain()
	}
}

func saveBounds() {
	if mainHwnd == 0 || isIconic(mainHwnd) || !isVisible(mainHwnd) {
		return
	}
	r := windowRect(mainHwnd)
	b, _ := json.Marshal(map[string]int32{"x": r.Left, "y": r.Top, "width": r.Right - r.Left, "height": r.Bottom - r.Top})
	mergeData(map[string]json.RawMessage{"nativeWindow": b})
}

func quitApp() {
	if quitting {
		return
	}
	quitting = true
	// Let the page log an unfinished work session, then it replies "flushed".
	if mainWeb != nil {
		mainWeb.Eval(`window.__flush ? window.__flush() : window.chrome.webview.postMessage(JSON.stringify({cmd:"flushed"}))`)
	}
	pSetTimer.Call(mainHwnd, timerQuit, 1500, 0)
}

var finalized bool

func finalQuit() {
	if finalized {
		return
	}
	finalized = true
	saveBounds()
	saveApps()
	removeTray()
	if alertHwnd != 0 {
		pDestroyWindow.Call(alertHwnd)
		alertHwnd = 0
	}
	pDestroyWindow.Call(mainHwnd)
}

func mainProc(hwnd, msg, wp, lp uintptr) uintptr {
	switch uint32(msg) {
	case wmNcCalcSize:
		if r, ok := onNcCalcSize(hwnd, wp, lp); ok {
			return r
		}
	case wmSize:
		if mainWeb != nil {
			mainWeb.Resize()
			notifyMaximized()
		}
	case wmMove:
		if mainWeb != nil {
			_ = mainWeb.NotifyParentWindowPositionChanged()
		}
	case wmActivate:
		if wp&0xFFFF != waInactive && mainWeb != nil {
			mainWeb.Focus()
			flashWindow(hwnd, false)
		}
	case wmExitSizeMove:
		saveBounds()
	case wmGetMinMaxInfo:
		mmi := (*minMaxInfo)(unsafe.Pointer(lp))
		s := dpiFor(hwnd)
		mmi.MinTrackSize = point{int32(340 * s), int32(320 * s)}
		return 0
	case wmDpiChanged:
		r := (*rect)(unsafe.Pointer(lp))
		setWindowPos(hwnd, 0, r.Left, r.Top, r.Right-r.Left, r.Bottom-r.Top, swpNoZOrder|swpNoActivate)
		return 0
	case wmClose:
		if !quitting && closeToTray {
			saveBounds()
			// keep the web view alive: the timer runs on in the tray
			showWindow(hwnd, swHide)
			emit("window-visible", false)
			return 0
		}
		quitApp()
		return 0
	case wmDestroy:
		pPostQuitMessage.Call(0)
		return 0
	case wmTimer:
		if wp == timerQuit {
			pKillTimer.Call(hwnd, timerQuit)
			finalQuit()
		}
		if wp == timerPhase {
			pKillTimer.Call(hwnd, timerPhase)
			emit("phase-due", true)
		}
		return 0
	case wmSettingChange:
		if lp != 0 && windows.UTF16PtrToString((*uint16)(unsafe.Pointer(lp))) == "ImmersiveColorSet" {
			if theme == "system" {
				applyTheme()
			}
			emit("system-theme-changed", systemDark())
		}
	case wmAppTray:
		onTrayEvent(uint32(lp & 0xFFFF))
		return 0
	case wmAppShow:
		showMain()
		return 0
	case wmAppDispatch:
		runDispatch()
		return 0
	default:
		if taskbarCreatedMsg != 0 && uint32(msg) == taskbarCreatedMsg {
			addTray()
			return 0
		}
	}
	r, _, _ := pDefWindowProcW.Call(hwnd, msg, wp, lp)
	return r
}

/* ---------------- alert window ---------------- */

func alertProc(hwnd, msg, wp, lp uintptr) uintptr {
	switch uint32(msg) {
	case wmClose:
		return 0 // must be answered with a button
	case wmSize:
		if alertWeb != nil {
			alertWeb.Resize()
		}
	case wmMove:
		if alertWeb != nil {
			_ = alertWeb.NotifyParentWindowPositionChanged()
		}
	case wmTimer:
		if wp == timerTop && isVisible(hwnd) {
			setWindowPos(hwnd, hwndTopmost, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoActivate|swpShowWindow)
		}
		return 0
	}
	r, _, _ := pDefWindowProcW.Call(hwnd, msg, wp, lp)
	return r
}

func onAlertMessage(s string) {
	var r rpc
	if json.Unmarshal([]byte(s), &r) != nil || r.Cmd == "" {
		return
	}
	switch r.Cmd {
	case "ready":
		alertReady = true
		if pendingAlert != "" {
			d := pendingAlert
			pendingAlert = ""
			showAlert(d)
		}
	case "act":
		hideAlert()
		emit("alert-action", arg[string](r, 0))
	}
}

func alertRect() (int32, int32, int32, int32) {
	// Bottom-right corner of the monitor with the mouse.
	wa := workAreaAt(cursorPos())
	s := dpiForPoint()
	w, h := int32(alertW*s), int32(alertH*s)
	margin := int32(12 * s)
	return wa.Right - w - margin, wa.Bottom - h - margin, w, h
}

func createAlertWindow() {
	x, y, w, h := alertRect()
	alertHwnd, _, _ = pCreateWindowExW.Call(
		wsExTopmost|wsExToolWindow,
		uintptr(unsafe.Pointer(u16(alertClass))),
		uintptr(unsafe.Pointer(u16(AppName))),
		wsPopup,
		uintptr(x), uintptr(y), uintptr(w), uintptr(h), 0, 0, moduleHandle(), 0)
	applyWindowTheme(alertHwnd, true)
	showWindow(alertHwnd, swShowNoActivate) // the web view must be created in a visible window
	bg := uint32(0x202020)
	if resolvedTheme() == "light" {
		bg = 0xFFFFFF
	}
	var ok bool
	alertWeb, ok = newWeb(alertHwnd, bg, onAlertMessage)
	if !ok {
		logf("alert webview failed")
		return
	}
	alertWeb.Init(alertBootJS)
	alertWeb.NavigateToString(alertHTML())
}

func showAlert(dataJSON string) {
	if !alertReady {
		pendingAlert = dataJSON
		if !alertCreating {
			alertCreating = true
			// Not from inside a WebView2 event handler: creating a web view pumps messages.
			dispatch(createAlertWindow)
		}
		return
	}
	applyTheme()
	x, y, w, h := alertRect()
	setWindowPos(alertHwnd, hwndTopmost, x, y, w, h, swpNoActivate)
	alertWeb.Eval("window.showAlert(" + dataJSON + ")")
	showWindow(alertHwnd, swShowNoActivate)
	setWindowPos(alertHwnd, hwndTopmost, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoActivate|swpShowWindow)
	wake(alertWeb)
	pSetTimer.Call(alertHwnd, timerTop, 1500, 0)
	if !isForeground() {
		flashWindow(mainHwnd, true)
	}
	logf("alert shown")
}

func dpiForPoint() float64 {
	// Monitor DPI under the cursor via a temporary rect check: fall back to window/system DPI.
	shcore := windows.NewLazySystemDLL("shcore.dll")
	p := shcore.NewProc("GetDpiForMonitor")
	if p.Find() == nil {
		pt := cursorPos()
		m, _, _ := pMonitorFromPoint.Call(uintptr(*(*uint64)(unsafe.Pointer(&pt))), monitorNearest)
		var dx, dy uint32
		if r, _, _ := p.Call(m, 0, uintptr(unsafe.Pointer(&dx)), uintptr(unsafe.Pointer(&dy))); r == 0 && dx > 0 {
			return float64(dx) / 96
		}
	}
	return dpiFor(mainHwnd)
}

func hideAlert() {
	pendingAlert = ""
	if alertHwnd == 0 {
		return
	}
	pKillTimer.Call(alertHwnd, timerTop)
	if alertWeb != nil {
		alertWeb.Eval("window.hideAlert&&window.hideAlert()")
	}
	sleepWeb(alertWeb)
	showWindow(alertHwnd, swHide)
	flashWindow(mainHwnd, false)
}

/* ---------------- startup ---------------- */

func registerClass(name string, proc func(hwnd, msg, wp, lp uintptr) uintptr, bg uintptr) {
	icon, _, _ := pLoadImageW.Call(moduleHandle(), iconID, imageIcon, 0, 0, lrDefaultSize|lrShared)
	cursor, _, _ := pLoadCursorW.Call(0, idcArrow)
	wc := wndClassExW{
		Size:       uint32(unsafe.Sizeof(wndClassExW{})),
		WndProc:    windows.NewCallback(proc),
		Instance:   moduleHandle(),
		Icon:       icon,
		IconSm:     icon,
		Cursor:     cursor,
		Background: bg,
		ClassName:  u16(name),
	}
	pRegisterClassExW.Call(uintptr(unsafe.Pointer(&wc)))
}

func loadSettings() {
	m := readData()
	var st struct {
		Theme       string `json:"theme"`
		CloseToTray *bool  `json:"closeToTray"`
		AlwaysOnTop bool   `json:"alwaysOnTop"`
	}
	if raw, ok := m["settings"]; ok {
		_ = json.Unmarshal(raw, &st)
	}
	if st.Theme != "" {
		theme = st.Theme
	}
	if st.CloseToTray != nil {
		closeToTray = *st.CloseToTray
	}
}

func initialBounds() (int32, int32, int32, int32) {
	s := dpiFor(0)
	w, h := int32(480*s), int32(760*s)
	m := readData()
	if raw, ok := m["nativeWindow"]; ok {
		var b struct{ X, Y, Width, Height int32 }
		if json.Unmarshal(raw, &b) == nil && b.Width > 200 && b.Height > 200 {
			if rectOnScreen(rect{b.X, b.Y, b.X + b.Width, b.Y + b.Height}) {
				return b.X, b.Y, b.Width, b.Height
			}
		}
	}
	wa := workAreaAt(cursorPos())
	return wa.Left + (wa.Right-wa.Left-w)/2, wa.Top + (wa.Bottom-wa.Top-h)/2, w, h
}

func main() {
	runtime.LockOSThread()

	if len(os.Args) > 1 && os.Args[1] == "--version" {
		fmt.Println(Version)
		return
	}

	// One instance: a second launch just brings the window forward.
	// LazyProc.Call returns GetLastError captured right after the call; windows.GetLastError()
	// afterwards is unreliable (the Go runtime may have overwritten it).
	if _, _, e := pCreateMutexW.Call(0, 0, uintptr(unsafe.Pointer(u16("YaytsaTimer.SingleInstance")))); e == windows.ERROR_ALREADY_EXISTS {
		if h, _, _ := pFindWindowW.Call(uintptr(unsafe.Pointer(u16(mainClass))), 0); h != 0 {
			pPostMessageW.Call(h, wmAppShow, 0, 0)
		}
		return
	}

	if pSetProcessDpiAwarenessContext.Find() == nil {
		pSetProcessDpiAwarenessContext.Call(^uintptr(3)) // PER_MONITOR_AWARE_V2 (-4)
	}
	// Sounds must play without a click first (the reminder rings by itself).
	// Lighter on RAM/CPU: one renderer for both windows, no background browser services.
	os.Setenv("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--autoplay-policy=no-user-gesture-required --disable-features=msSmartScreenProtection,msEdgeTranslate,msWebOOUI,msPdfOOUI,AutofillServerCommunication --renderer-process-limit=1 --disable-background-networking --disable-component-update --disable-sync --disable-domain-reliability --no-first-run")

	migrate()
	loadSettings()
	logf("start %s", Version)

	p := pal()
	bgBrush, _, _ = pCreateSolidBrush.Call(uintptr(colorref(p.bg)))
	registerClass(mainClass, mainProc, bgBrush)
	alertBrush, _, _ := pCreateSolidBrush.Call(uintptr(colorref(0x202020)))
	registerClass(alertClass, alertProc, alertBrush)
	taskbarCreatedMsg = func() uint32 {
		r, _, _ := pRegisterWindowMessageW.Call(uintptr(unsafe.Pointer(u16("TaskbarCreated"))))
		return uint32(r)
	}()

	x, y, w, h := initialBounds()
	mainHwnd, _, _ = pCreateWindowExW.Call(0,
		uintptr(unsafe.Pointer(u16(mainClass))),
		uintptr(unsafe.Pointer(u16(AppName))),
		wsOverlappedWin,
		uintptr(x), uintptr(y), uintptr(w), uintptr(h),
		0, 0, moduleHandle(), 0)
	applyWindowTheme(mainHwnd, false)
	refreshFrame(mainHwnd) // apply the caption-less frame
	startHidden := len(os.Args) > 1 && strings.EqualFold(os.Args[1], "--hidden")
	if !startHidden {
		showWindow(mainHwnd, swShow) // the web view must be created in a visible window
		// The first ShowWindow may use the launcher's STARTUPINFO (e.g. minimized); insist on normal.
		showWindow(mainHwnd, swRestore)
	}

	var ok bool
	mainWeb, ok = newWeb(mainHwnd, p.bg, onMainMessage)
	if !ok {
		logf("WebView2 runtime not available")
		if messageBox("Для работы нужен компонент Microsoft Edge WebView2 Runtime. Открыть страницу загрузки?\n\nMicrosoft Edge WebView2 Runtime is required. Open the download page?", AppName, 0x4|0x30) == 6 {
			shellOpen("https://go.microsoft.com/fwlink/p/?LinkId=2124703", "")
		}
		return
	}
	mainWeb.Init(mainBootJS)
	mainWeb.NavigateToString(mainHTML())

	if !startHidden {
		wake(mainWeb)
		mainWeb.Focus()
	}
	addTray()
	go updateLoop()
	loadApps()
	go appTrackLoop()

	var m msgT
	for {
		r, _, _ := pGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			break
		}
		pTranslateMessage.Call(uintptr(unsafe.Pointer(&m)))
		pDispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
	}
	removeTray()
	logf("exit")
}
