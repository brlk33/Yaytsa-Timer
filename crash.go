//go:build windows

package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime/debug"
	"time"
)

/*
Crash safety.
  - Every data file is written to a temp file, flushed to the disk (fsync), then renamed over the
    old one, so a crash or power cut mid-write never leaves a half file; data.json also keeps the
    last good copy in data.json.bak, and loading falls back to it.
  - running.json lives while the app runs (refreshed every 30 s) and is removed on a clean exit
    (quit, update, Windows shutdown). If it is still there at the next start, the last run ended
    unexpectedly: the page is told when it was last alive and when the data was last saved.
*/

func markerFile() string { return filepath.Join(dataDir(), "running.json") }

var lastCrash json.RawMessage // what the page shows once after an unexpected end

// writeFileSync writes b to path safely: temp file, flush to disk, rename.
func writeFileSync(path string, b []byte) error {
	tmp := path + ".tmp"
	f, err := os.OpenFile(tmp, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	if _, err = f.Write(b); err == nil {
		err = f.Sync()
	}
	if cerr := f.Close(); err == nil {
		err = cerr
	}
	if err != nil {
		_ = os.Remove(tmp)
		return err
	}
	return os.Rename(tmp, path)
}

func writeMarker(started int64) {
	b, _ := json.Marshal(map[string]any{"started": started, "alive": time.Now().UnixMilli(), "version": Version, "pid": os.Getpid()})
	_ = writeFileSync(markerFile(), b)
}

var markerStarted = time.Now().UnixMilli()

// checkCrash runs once at start, before the marker of this run is written.
func checkCrash() {
	if b, err := os.ReadFile(markerFile()); err == nil {
		var m struct {
			Alive   int64  `json:"alive"`
			Version string `json:"version"`
		}
		_ = json.Unmarshal(b, &m)
		if m.Alive == 0 {
			if st, err := os.Stat(markerFile()); err == nil {
				m.Alive = st.ModTime().UnixMilli()
			}
		}
		var saved int64
		if st, err := os.Stat(dataFile()); err == nil {
			saved = st.ModTime().UnixMilli()
		}
		lastCrash, _ = json.Marshal(map[string]any{"alive": m.Alive, "saved": saved, "version": m.Version})
		logf("the last run (%s) ended unexpectedly; last alive %s", m.Version, time.UnixMilli(m.Alive).Format(time.RFC3339))
	}
	writeMarker(markerStarted)
}

func heartbeat() { writeMarker(markerStarted) }

// clearMarker: this run ends cleanly.
func clearMarker() { _ = os.Remove(markerFile()) }

// guard logs a panic with its stack before the process dies (the marker stays: next start says so).
func guard(where string) {
	if r := recover(); r != nil {
		logf("panic in %s: %v\n%s", where, r, debug.Stack())
		panic(r)
	}
}
