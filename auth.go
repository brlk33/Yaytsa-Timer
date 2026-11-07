//go:build windows

package main

import (
	"io"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Google sign-in for sync: Google does not allow it inside embedded web views, so the site
// signs in in the real browser and sends the session back to a one-off page on 127.0.0.1.
// The page reads it from the URL fragment (never sent over the network) and posts it here.

var (
	authMu   sync.Mutex
	authSrv  *http.Server
	authWant string
	stateRe  = regexp.MustCompile(`^[0-9a-f]{16,64}$`)
)

const authPage = `<!doctype html><meta charset="utf-8"><title>Яйцетаймер</title>
<style>body{font:16px system-ui,sans-serif;background:#191919;color:#eee;display:grid;place-items:center;height:100vh;margin:0}p{max-width:360px;text-align:center;line-height:1.5}</style>
<p id="m">…</p>
<script>
const h = location.hash.slice(1);
history.replaceState(null, '', '/cb');
fetch('/done', { method: 'POST', body: h }).then(r => r.ok, () => false).then(ok => {
  document.getElementById('m').textContent = ok
    ? 'Готово. Яйцетаймер подключён, эту вкладку можно закрыть.'
    : 'Ссылка устарела. Нажмите «Войти через Google» в Яйцетаймере ещё раз.';
});
</script>`

func startAuth(state, site string) {
	if !stateRe.MatchString(state) || !strings.HasPrefix(site, "https://") {
		return
	}
	authMu.Lock()
	defer authMu.Unlock()
	authWant = state
	if authSrv == nil {
		ln, err := net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			logf("auth listen: %v", err)
			return
		}
		mux := http.NewServeMux()
		mux.HandleFunc("/cb", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Header().Set("Cache-Control", "no-store")
			io.WriteString(w, authPage)
		})
		mux.HandleFunc("/done", authDone)
		srv := &http.Server{Handler: mux, ReadHeaderTimeout: 10 * time.Second}
		authSrv = srv
		go srv.Serve(ln)
		port := ln.Addr().(*net.TCPAddr).Port
		go func() { // the link is good for 15 minutes
			time.Sleep(15 * time.Minute)
			stopAuth(srv)
		}()
		authPort = port
	}
	shellOpen(site+"#timer-login/p"+strconv.Itoa(authPort)+"/"+state, "")
}

var authPort int

func stopAuth(srv *http.Server) {
	authMu.Lock()
	defer authMu.Unlock()
	if authSrv == srv && srv != nil {
		srv.Close()
		authSrv = nil
		authWant = ""
	}
}

func authDone(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}
	b, _ := io.ReadAll(io.LimitReader(r.Body, 8192))
	q, _ := url.ParseQuery(string(b))
	state, rt := q.Get("state"), q.Get("rt")
	authMu.Lock()
	ok := authWant != "" && state == authWant && rt != ""
	srv := authSrv
	authMu.Unlock()
	if !ok {
		http.Error(w, "", http.StatusForbidden)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	dispatch(func() {
		emit("auth-result", map[string]string{"state": state, "rt": rt})
		showMain()
	})
	go func() {
		time.Sleep(2 * time.Second)
		stopAuth(srv)
	}()
}
