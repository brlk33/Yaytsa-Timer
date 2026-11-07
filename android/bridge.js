// Android host bridge: the same window.focusApi the desktop build provides (see web.go),
// backed by the Java object `YTB`. Calls go out as JSON {id, cmd, args}; replies come back
// through window.__reply(id, value), events through window.__emit(name, value).
(() => {
  document.documentElement.classList.add('native', 'android');
  let seq = 0;
  const pending = new Map();
  const handlers = {};
  const send = (id, cmd, args) => YTB.post(JSON.stringify({ id, cmd, args }));
  const post = (cmd, ...args) => send(0, cmd, args);
  const call = (cmd, ...args) => new Promise(res => {
    const id = ++seq;
    pending.set(id, res);
    send(id, cmd, args);
  });
  // Synchronous calls for data the page needs before its first frame.
  const sync = (cmd, ...args) => { try { return JSON.parse(YTB.sync(JSON.stringify({ cmd, args })) || 'null'); } catch (e) { return null; } };
  const on = name => cb => { (handlers[name] = handlers[name] || []).push(cb); };
  const noop = () => {};
  window.__reply = (id, v) => { const r = pending.get(id); if (r) { pending.delete(id); r(v); } };
  window.__emit = (name, v) => (handlers[name] || []).forEach(cb => { try { cb(v); } catch (e) {} });

  window.focusApi = {
    android: true,
    load: () => Promise.resolve(sync('load')),
    save: p => Promise.resolve(sync('save', p)),
    saveSync: p => sync('save', p),
    notify: (title, body) => post('notify', title || '', body || ''),
    progress: noop,
    schedule: noop,               // the alarm follows timerState instead
    timerState: s => post('timerState', s),
    onTimerState: on('timer-state'),
    onPhaseDue: on('phase-due'),
    ncdrag: noop, winMin: noop, winMax: noop,
    winClose: () => post('background'),
    onMaximized: noop,
    onWindowVisible: on('window-visible'),
    zoom: noop,
    appsInstalled: () => Promise.resolve([]),
    appsBrowse: () => Promise.resolve(null),
    title: noop,
    theme: t => post('theme', t),
    systemDark: () => Promise.resolve(!!sync('systemDark')),
    onSystemTheme: on('system-theme-changed'),
    alwaysOnTop: noop,
    focusWindow: noop,
    exportCsv: (csv, name) => call('exportCsv', csv, name),
    openDataFolder: noop,
    showAlert: d => post('showAlert', d),
    closeAlert: () => post('closeAlert'),
    onAlertAction: on('alert-action'),
    updateTray: noop,
    onTrayAction: on('tray-action'),
    quit: () => post('background'),
    log: m => post('log', String(m)),
    onUpdateReady: on('update-ready'),
    installUpdate: () => post('installUpdate'),
    autostart: () => Promise.resolve(false),
    setAutostart: () => Promise.resolve(false),
    appsStats: () => Promise.resolve([]),
    appsCandidates: () => Promise.resolve([]),
    appsTrack: () => Promise.resolve([]),
    appsUntrack: () => Promise.resolve([]),
    ready: () => post('ready'),
    authBrowser: (state, site) => post('authBrowser', state, site),
    onAuthResult: on('auth-result'),
    openUrl: u => post('openUrl', u),
    soundInfo: () => call('soundInfo'),
    pickSound: kind => call('pickSound', kind),
  };
})();
