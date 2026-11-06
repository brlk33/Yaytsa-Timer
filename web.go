package main

import (
	_ "embed"
	"regexp"
	"strings"
)

//go:embed web/index.html
var indexHTML string

//go:embed web/style.css
var styleCSS string

//go:embed web/app.js
var appJS string

//go:embed web/alert.html
var alertHTMLSrc string

//go:embed web/alert.js
var alertJS string

var cspMeta = regexp.MustCompile(`(?i)<meta http-equiv="Content-Security-Policy"[^>]*>`)

// Pages are loaded with NavigateToString, so CSS and JS are inlined into one document.
func inline(html string, css map[string]string, js map[string]string) string {
	html = cspMeta.ReplaceAllString(html, "")
	for name, body := range css {
		html = strings.Replace(html, `<link rel="stylesheet" href="`+name+`">`, "<style>\n"+body+"\n</style>", 1)
	}
	for name, body := range js {
		html = strings.Replace(html, `<script src="`+name+`"></script>`, "<script>\n"+body+"\n</script>", 1)
	}
	return html
}

func mainHTML() string {
	return inline(indexHTML, map[string]string{"style.css": styleCSS}, map[string]string{"app.js": appJS})
}

func alertHTML() string {
	return inline(alertHTMLSrc, nil, map[string]string{"alert.js": alertJS})
}

// Bridge for the main page: the same window.focusApi the UI was written against.
const mainBootJS = `
(() => {
  const markNative = () => document.documentElement && document.documentElement.classList.add('native');
  if (document.documentElement) markNative(); else document.addEventListener('readystatechange', markNative, { once: true });
  const wv = window.chrome.webview;
  let seq = 0;
  const pending = new Map();
  const handlers = {};
  const post = (cmd, ...args) => wv.postMessage(JSON.stringify({ id: 0, cmd, args }));
  const call = (cmd, ...args) => new Promise(res => {
    const id = ++seq;
    pending.set(id, res);
    wv.postMessage(JSON.stringify({ id, cmd, args }));
  });
  const on = name => cb => { (handlers[name] = handlers[name] || []).push(cb); };
  window.__reply = (id, v) => { const r = pending.get(id); if (r) { pending.delete(id); r(v); } };
  window.__emit = (name, v) => (handlers[name] || []).forEach(cb => { try { cb(v); } catch (e) {} });
  window.__flush = () => {
    try { window.__beforeQuit && window.__beforeQuit(); } catch (e) {}
    post('flushed');
  };
  window.focusApi = {
    load: () => call('load'),
    save: p => call('save', p),
    saveSync: p => post('save', p),
    notify: () => post('flash'),
    progress: () => {},
    title: t => post('title', t),
    theme: t => post('theme', t),
    systemDark: () => call('systemDark'),
    onSystemTheme: on('system-theme-changed'),
    alwaysOnTop: v => post('alwaysOnTop', !!v),
    focusWindow: () => post('focusWindow'),
    exportCsv: (csv, name) => call('exportCsv', csv, name),
    openDataFolder: () => post('openDataFolder'),
    showAlert: d => post('showAlert', d),
    closeAlert: () => post('closeAlert'),
    onAlertAction: on('alert-action'),
    updateTray: s => post('updateTray', s),
    onTrayAction: on('tray-action'),
    quit: () => post('quit'),
    log: m => post('log', String(m)),
    onUpdateReady: on('update-ready'),
    installUpdate: () => post('installUpdate'),
  };
})();
`

const alertBootJS = `
window.alertApi = {
  act: a => window.chrome.webview.postMessage(JSON.stringify({ cmd: 'act', args: [a] })),
  ready: () => window.chrome.webview.postMessage(JSON.stringify({ cmd: 'ready', args: [] })),
};
`
