//go:build windows

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"
	"unsafe"

	"golang.org/x/sys/windows"
	"golang.org/x/sys/windows/registry"
)

/*
App time tracking, Steam-style: for every program the user picked we count
  run    — seconds the program was open (any process with that exe name exists),
  active — seconds its window was in the foreground while the user was at the PC.
Stored per local day in %APPDATA%\YaytsaTimer\apps.json (owned by this file only,
so it never races with the page's data.json writes).
*/

type appInfo struct {
	Exe  string `json:"exe"` // lower-case base name, e.g. "afterfx.exe"
	Name string `json:"name"`
	Path string `json:"path"`
}

type appTimes struct {
	Run    float64 `json:"run"`
	Active float64 `json:"active"`
}

type appsStore struct {
	Tracked []appInfo                       `json:"tracked"`
	Days    map[string]map[string]*appTimes `json:"days"`
}

const (
	appTick     = 5 * time.Second
	appIdleSecs = 5 * 60
)

var (
	apps      = appsStore{Days: map[string]map[string]*appTimes{}}
	appsMu    sync.Mutex
	appsDirty bool
	appsLast  string // exe names running at the last sample, for the UI

	pGetForegroundWindow = user32.NewProc("GetForegroundWindow")
	pGetLastInputInfo    = user32.NewProc("GetLastInputInfo")
	pGetWindow           = user32.NewProc("GetWindow")
	pGetWindowLongPtrW   = user32.NewProc("GetWindowLongPtrW")
	pGetWindowTextLength = user32.NewProc("GetWindowTextLengthW")
	pGetTickCount        = kernel32.NewProc("GetTickCount")
	pDwmGetWindowAttr    = dwmapi.NewProc("DwmGetWindowAttribute")
)

func appsFile() string { return filepath.Join(dataDir(), "apps.json") }

func loadApps() {
	appsMu.Lock()
	defer appsMu.Unlock()
	b, err := os.ReadFile(appsFile())
	if err != nil {
		return
	}
	var s appsStore
	if json.Unmarshal(b, &s) == nil {
		if s.Days == nil {
			s.Days = map[string]map[string]*appTimes{}
		}
		apps = s
	}
}

func saveApps() {
	appsMu.Lock()
	if !appsDirty {
		appsMu.Unlock()
		return
	}
	b, err := json.Marshal(apps)
	appsDirty = false
	appsMu.Unlock()
	if err != nil {
		return
	}
	tmp := appsFile() + ".tmp"
	if os.WriteFile(tmp, b, 0o644) == nil {
		_ = os.Rename(tmp, appsFile())
	}
}

func dayKeyOf(t time.Time) string { return t.Format("2006-01-02") }

/* ---------------- sampling ---------------- */

// runningExes maps pid -> lower-case exe base name for all processes.
func runningExes() map[uint32]string {
	out := map[uint32]string{}
	snap, err := windows.CreateToolhelp32Snapshot(windows.TH32CS_SNAPPROCESS, 0)
	if err != nil {
		return out
	}
	defer windows.CloseHandle(snap)
	var e windows.ProcessEntry32
	e.Size = uint32(unsafe.Sizeof(e))
	for err = windows.Process32First(snap, &e); err == nil; err = windows.Process32Next(snap, &e) {
		out[e.ProcessID] = strings.ToLower(windows.UTF16ToString(e.ExeFile[:]))
	}
	return out
}

func foregroundPid() uint32 {
	h, _, _ := pGetForegroundWindow.Call()
	if h == 0 {
		return 0
	}
	var pid uint32
	windows.GetWindowThreadProcessId(windows.HWND(h), &pid)
	return pid
}

func idleSeconds() uint32 {
	var li struct{ Size, Time uint32 }
	li.Size = 8
	if r, _, _ := pGetLastInputInfo.Call(uintptr(unsafe.Pointer(&li))); r == 0 {
		return 0
	}
	now, _, _ := pGetTickCount.Call()
	return (uint32(now) - li.Time) / 1000
}

func sampleApps(dt float64) {
	appsMu.Lock()
	n := len(apps.Tracked)
	appsMu.Unlock()
	if n == 0 {
		return
	}
	procs := runningExes()
	running := map[string]bool{}
	for _, exe := range procs {
		running[exe] = true
	}
	fg := procs[foregroundPid()]
	away := idleSeconds() >= appIdleSecs

	appsMu.Lock()
	defer appsMu.Unlock()
	day := dayKeyOf(time.Now())
	d := apps.Days[day]
	if d == nil {
		d = map[string]*appTimes{}
		apps.Days[day] = d
	}
	var names []string
	for _, a := range apps.Tracked {
		if !running[a.Exe] {
			continue
		}
		names = append(names, a.Exe)
		t := d[a.Exe]
		if t == nil {
			t = &appTimes{}
			d[a.Exe] = t
		}
		t.Run += dt
		if fg == a.Exe && !away {
			t.Active += dt
		}
		appsDirty = true
	}
	appsLast = strings.Join(names, "|")
}

func appTrackLoop() {
	last := time.Now()
	lastSave := last
	for {
		time.Sleep(appTick)
		now := time.Now()
		dt := now.Sub(last)
		last = now
		if dt > 3*appTick { // sleep / hibernation: don't count the gap
			dt = appTick
		}
		sampleApps(dt.Seconds())
		if now.Sub(lastSave) >= time.Minute {
			saveApps()
			lastSave = now
		}
	}
}

/* ---------------- bridge ---------------- */

type appStat struct {
	appInfo
	Running bool     `json:"running"`
	Today   appTimes `json:"today"`
	Week    appTimes `json:"week"`
	Month   appTimes `json:"month"`
	Total   appTimes `json:"total"`
	Days    int      `json:"days"` // days with any use
}

func appsStats() []appStat {
	appsMu.Lock()
	defer appsMu.Unlock()
	now := time.Now()
	today := dayKeyOf(now)
	weekFrom := dayKeyOf(now.AddDate(0, 0, -6))
	monthFrom := dayKeyOf(now.AddDate(0, 0, -29))
	running := map[string]bool{}
	for _, e := range strings.Split(appsLast, "|") {
		running[e] = true
	}
	out := make([]appStat, 0, len(apps.Tracked))
	for _, a := range apps.Tracked {
		s := appStat{appInfo: a, Running: running[a.Exe]}
		for day, m := range apps.Days {
			t := m[a.Exe]
			if t == nil {
				continue
			}
			add := func(x *appTimes) { x.Run += t.Run; x.Active += t.Active }
			add(&s.Total)
			if t.Run >= 60 {
				s.Days++
			}
			if day >= monthFrom {
				add(&s.Month)
			}
			if day >= weekFrom {
				add(&s.Week)
			}
			if day == today {
				add(&s.Today)
			}
		}
		out = append(out, s)
	}
	return out
}

func trackApp(a appInfo) {
	a.Exe = strings.ToLower(filepath.Base(a.Exe))
	if a.Exe == "" || a.Exe == "." {
		return
	}
	if a.Name == "" {
		a.Name = strings.TrimSuffix(a.Exe, ".exe")
	}
	appsMu.Lock()
	for _, t := range apps.Tracked {
		if t.Exe == a.Exe {
			appsMu.Unlock()
			return
		}
	}
	apps.Tracked = append(apps.Tracked, a)
	appsDirty = true
	appsMu.Unlock()
	saveApps()
	go sampleApps(0) // refresh "running" right away
}

// untrackApp stops tracking; the history stays, so adding it back restores the hours.
func untrackApp(exe string) {
	appsMu.Lock()
	kept := apps.Tracked[:0]
	for _, t := range apps.Tracked {
		if t.Exe != exe {
			kept = append(kept, t)
		}
	}
	apps.Tracked = kept
	appsDirty = true
	appsMu.Unlock()
	saveApps()
}

/* ---------------- candidates: programs with a window open now ---------------- */

var (
	enumCb    = windows.NewCallback(enumWindowProc)
	enumPids  map[uint32]bool
	enumMutex sync.Mutex
)

func enumWindowProc(h uintptr, _ uintptr) uintptr {
	if !isVisible(h) {
		return 1
	}
	if owner, _, _ := pGetWindow.Call(h, 4); owner != 0 { // GW_OWNER
		return 1
	}
	ex, _, _ := pGetWindowLongPtrW.Call(h, ^uintptr(19)) // GWL_EXSTYLE (-20)
	if ex&wsExToolWindow != 0 {
		return 1
	}
	if n, _, _ := pGetWindowTextLength.Call(h); n == 0 {
		return 1
	}
	var cloaked uint32
	if pDwmGetWindowAttr.Find() == nil {
		pDwmGetWindowAttr.Call(h, 14, uintptr(unsafe.Pointer(&cloaked)), 4) // DWMWA_CLOAKED
	}
	if cloaked != 0 {
		return 1
	}
	var pid uint32
	windows.GetWindowThreadProcessId(windows.HWND(h), &pid)
	enumPids[pid] = true
	return 1
}

func processPath(pid uint32) string {
	h, err := windows.OpenProcess(windows.PROCESS_QUERY_LIMITED_INFORMATION, false, pid)
	if err != nil {
		return ""
	}
	defer windows.CloseHandle(h)
	buf := make([]uint16, 1024)
	n := uint32(len(buf))
	if windows.QueryFullProcessImageName(h, 0, &buf[0], &n) != nil {
		return ""
	}
	return windows.UTF16ToString(buf[:n])
}

func fileDescription(path string) string {
	var zero windows.Handle
	size, err := windows.GetFileVersionInfoSize(path, &zero)
	if err != nil || size == 0 {
		return ""
	}
	buf := make([]byte, size)
	if windows.GetFileVersionInfo(path, 0, size, unsafe.Pointer(&buf[0])) != nil {
		return ""
	}
	var p unsafe.Pointer
	var l uint32
	if windows.VerQueryValue(unsafe.Pointer(&buf[0]), `\VarFileInfo\Translation`, unsafe.Pointer(&p), &l) != nil || l < 4 {
		return ""
	}
	lang, cp := *(*uint16)(p), *(*uint16)(unsafe.Add(p, 2))
	key := fmt.Sprintf(`\StringFileInfo\%04x%04x\FileDescription`, lang, cp)
	if windows.VerQueryValue(unsafe.Pointer(&buf[0]), key, unsafe.Pointer(&p), &l) != nil || l == 0 {
		return ""
	}
	return strings.TrimSpace(windows.UTF16PtrToString((*uint16)(p)))
}

func appCandidates() []appInfo {
	enumMutex.Lock()
	enumPids = map[uint32]bool{}
	_ = windows.EnumWindows(enumCb, nil)
	pids := enumPids
	enumMutex.Unlock()

	self := uint32(os.Getpid())
	appsMu.Lock()
	tracked := map[string]bool{}
	for _, t := range apps.Tracked {
		tracked[t.Exe] = true
	}
	appsMu.Unlock()

	seen := map[string]bool{}
	var out []appInfo
	for pid := range pids {
		if pid == self {
			continue
		}
		p := processPath(pid)
		if p == "" {
			continue
		}
		exe := strings.ToLower(filepath.Base(p))
		if seen[exe] || tracked[exe] || exe == "explorer.exe" || exe == "applicationframehost.exe" || exe == "textinputhost.exe" {
			continue
		}
		seen[exe] = true
		name := fileDescription(p)
		if name == "" {
			name = strings.TrimSuffix(filepath.Base(p), filepath.Ext(p))
		}
		out = append(out, appInfo{Exe: exe, Name: name, Path: p})
	}
	sort.Slice(out, func(i, j int) bool { return strings.ToLower(out[i].Name) < strings.ToLower(out[j].Name) })
	return out
}

/* ---------------- launch with Windows ---------------- */

const runKey = `Software\Microsoft\Windows\CurrentVersion\Run`
const runValue = "YaytsaTimer"

func autostartEnabled() bool {
	k, err := registry.OpenKey(registry.CURRENT_USER, runKey, registry.QUERY_VALUE)
	if err != nil {
		return false
	}
	defer k.Close()
	_, _, err = k.GetStringValue(runValue)
	return err == nil
}

func setAutostart(on bool) bool {
	k, _, err := registry.CreateKey(registry.CURRENT_USER, runKey, registry.SET_VALUE)
	if err != nil {
		return false
	}
	defer k.Close()
	if !on {
		err = k.DeleteValue(runValue)
		return err == nil || err == registry.ErrNotExist
	}
	exe, err := os.Executable()
	if err != nil {
		return false
	}
	return k.SetStringValue(runValue, `"`+exe+`" --hidden`) == nil
}
