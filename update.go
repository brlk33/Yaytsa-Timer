//go:build windows

package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"
	"unsafe"

	"golang.org/x/sys/windows"
)

// Self-update: version.txt and the installer live in the GitHub repo.
const (
	repoRaw      = "https://github.com/brlk33/Yaytsa-Timer/raw/main/"
	setupName    = "YaytsaTimer-Setup.exe"
	checkEvery   = 6 * time.Hour
	firstCheckIn = 8 * time.Second
)

var downloadedSetup string

func newer(remote, local string) bool {
	parse := func(v string) [3]int {
		var out [3]int
		for i, p := range strings.SplitN(strings.TrimSpace(strings.TrimPrefix(v, "v")), ".", 3) {
			out[i], _ = strconv.Atoi(strings.TrimFunc(p, func(r rune) bool { return r < '0' || r > '9' }))
		}
		return out
	}
	a, b := parse(remote), parse(local)
	for i := 0; i < 3; i++ {
		if a[i] != b[i] {
			return a[i] > b[i]
		}
	}
	return false
}

var (
	urlmon               = windows.NewLazySystemDLL("urlmon.dll")
	pURLDownloadToFileW  = urlmon.NewProc("URLDownloadToFileW")
	wininet              = windows.NewLazySystemDLL("wininet.dll")
	pDeleteUrlCacheEntry = wininet.NewProc("DeleteUrlCacheEntryW")
)

// Downloads with the Windows downloader (respects system proxy settings, keeps the exe small).
func download(url, dest string) error {
	pDeleteUrlCacheEntry.Call(uintptr(unsafe.Pointer(u16(url))))
	r, _, _ := pURLDownloadToFileW.Call(0, uintptr(unsafe.Pointer(u16(url))), uintptr(unsafe.Pointer(u16(dest))), 0, 0)
	if r != 0 {
		return syscall.Errno(r)
	}
	return nil
}

func fetch(url string) ([]byte, error) {
	tmp := filepath.Join(os.TempDir(), "yaytsa-timer-"+strconv.FormatInt(time.Now().UnixNano(), 36))
	defer os.Remove(tmp)
	if err := download(url, tmp); err != nil {
		return nil, err
	}
	return os.ReadFile(tmp)
}

func checkUpdate() {
	b, err := fetch(repoRaw + "version.txt?t=" + strconv.FormatInt(time.Now().Unix(), 10))
	if err != nil {
		logf("update check: %v", err)
		return
	}
	remote := strings.TrimSpace(string(b))
	if !newer(remote, Version) || downloadedSetup != "" {
		return
	}
	p := filepath.Join(os.TempDir(), "YaytsaTimer-Setup-"+remote+".exe")
	if err := download(repoRaw+setupName+"?v="+remote, p); err != nil {
		logf("update download failed: %v", err)
		return
	}
	if b, err := os.ReadFile(p); err != nil || len(b) < 100_000 || string(b[:2]) != "MZ" {
		logf("update file invalid")
		os.Remove(p)
		return
	}
	downloadedSetup = p
	logf("update %s downloaded", remote)
	dispatch(func() { emit("update-ready", remote) })
}

func updateLoop() {
	time.Sleep(firstCheckIn)
	for {
		checkUpdate()
		time.Sleep(checkEvery)
	}
}

// Runs the downloaded installer silently; it closes this app, installs and starts the new version.
func installUpdate() {
	if downloadedSetup == "" {
		return
	}
	cmd := exec.Command(downloadedSetup, "/S")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Start(); err != nil {
		logf("update start: %v", err)
		return
	}
	quitApp()
}
