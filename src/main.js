const { app, BrowserWindow, ipcMain, Notification, dialog, shell, nativeTheme, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const system = require('./system');

const APP_ID = 'com.yaytsa.timer';
app.setAppUserModelId(APP_ID);

// Data lives in %APPDATA%\YaytsaTimer. Bring over history from the early "Focus" build if present.
app.setPath('userData', path.join(app.getPath('appData'), 'YaytsaTimer'));
(function migrate() {
  try {
    const to = path.join(app.getPath('userData'), 'data.json');
    const from = path.join(app.getPath('appData'), 'Focus', 'data.json');
    if (!fs.existsSync(to) && fs.existsSync(from)) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  } catch {}
})();

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

process.on('uncaughtException', (e) => system.log('uncaught', e));

let quitting = false;

let win = null;
let alertWin = null;
let alertKeepTop = null;

const ALERT_W = 380;
const ALERT_H = 160;

function closeAlert() {
  clearInterval(alertKeepTop);
  alertKeepTop = null;
  if (alertWin && !alertWin.isDestroyed()) alertWin.destroy();
  alertWin = null;
  if (win && !win.isDestroyed()) win.flashFrame(false);
}

function showAlert(data) {
  closeAlert();
  // Show on the monitor where the mouse is
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const wa = display.workArea;
  const b = display.bounds;
  // If a fullscreen app hides the taskbar, workArea still excludes it; use bounds edge then
  const x = Math.round(wa.x + wa.width - ALERT_W - 12);
  const y = Math.round(Math.min(wa.y + wa.height, b.y + b.height) - ALERT_H - 12);

  alertWin = new BrowserWindow({
    width: ALERT_W,
    height: ALERT_H,
    x, y,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: true,
    show: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'alert-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      autoplayPolicy: 'no-user-gesture-required',
    },
  });
  alertWin.setAlwaysOnTop(true, 'screen-saver');
  alertWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  alertWin.loadFile(path.join(__dirname, 'renderer', 'alert.html'), { query: { d: JSON.stringify(data) } });
  alertWin.once('ready-to-show', () => {
    if (!alertWin) return;
    alertWin.showInactive();
    alertWin.moveTop();
  });
  // The user must answer: block closing via Alt+F4
  alertWin.on('close', (e) => { if (alertWin) e.preventDefault(); });
  // Keep it on top of anything that grabs topmost later (players, other overlays)
  alertKeepTop = setInterval(() => {
    if (!alertWin || alertWin.isDestroyed()) return;
    if (!alertWin.isVisible()) alertWin.showInactive();
    alertWin.setAlwaysOnTop(true, 'screen-saver');
    alertWin.moveTop();
  }, 1500);
  if (win && !win.isDestroyed() && !win.isFocused()) win.flashFrame(true);
}

const dataDir = () => app.getPath('userData');
const dataFile = () => path.join(dataDir(), 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    // try backup
    try { return JSON.parse(fs.readFileSync(dataFile() + '.bak', 'utf8')); } catch { return null; }
  }
}

function writeData(data) {
  fs.mkdirSync(dataDir(), { recursive: true });
  const file = dataFile();
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 1), 'utf8');
  if (fs.existsSync(file)) {
    try { fs.copyFileSync(file, file + '.bak'); } catch {}
  }
  fs.renameSync(tmp, file);
}

const THEMES = {
  dark: { bg: '#191919', symbol: '#9b9b9b' },
  light: { bg: '#ffffff', symbol: '#787774' },
};

function resolveTheme(t) {
  if (t === 'system') return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  return t === 'light' ? 'light' : 'dark';
}

function createWindow() {
  const saved = readData();
  const bounds = (saved && saved.window) || {};
  const theme = resolveTheme(saved && saved.settings && saved.settings.theme);
  const colors = THEMES[theme];

  win = new BrowserWindow({
    width: bounds.width || 460,
    height: bounds.height || 700,
    x: bounds.x,
    y: bounds.y,
    minWidth: 380,
    minHeight: 560,
    backgroundColor: colors.bg,
    title: system.APP_NAME,
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: colors.bg, symbolColor: colors.symbol, height: 40 },
    alwaysOnTop: !!(saved && saved.settings && saved.settings.alwaysOnTop),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      spellcheck: false,
    },
  });

  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());

  const persistBounds = () => {
    if (!win || win.isDestroyed() || win.isMinimized() || win.isMaximized()) return;
    const d = readData() || {};
    d.window = win.getBounds();
    try { writeData(d); } catch {}
  };
  let t = null;
  const debounced = () => { clearTimeout(t); t = setTimeout(persistBounds, 600); };
  win.on('resize', debounced);
  win.on('move', debounced);
  win.on('close', (e) => {
    persistBounds();
    const s = (readData() || {}).settings || {};
    if (!quitting && s.closeToTray !== false) {
      e.preventDefault();
      win.hide();
    }
  });
  win.on('closed', () => { win = null; closeAlert(); });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function showWindow() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function quitApp() {
  quitting = true;
  app.quit();
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
});

app.whenReady().then(() => {
  ipcMain.handle('data:load', () => readData());
  ipcMain.handle('data:save', (_e, partial) => {
    const d = readData() || {};
    Object.assign(d, partial);
    writeData(d);
    return true;
  });

  ipcMain.on('data:save-sync', (e, partial) => {
    try {
      const d = readData() || {};
      Object.assign(d, partial);
      writeData(d);
      e.returnValue = true;
    } catch { e.returnValue = false; }
  });

  ipcMain.on('notify', (_e, { title, body }) => {
    if (!Notification.isSupported()) return;
    const n = new Notification({ title, body, silent: true, icon: path.join(__dirname, 'icon.png') });
    n.on('click', () => { if (win) { win.show(); win.focus(); } });
    n.show();
  });

  ipcMain.on('progress', (_e, { value, paused }) => {
    if (!win) return;
    if (value < 0) win.setProgressBar(-1);
    else win.setProgressBar(value, { mode: paused ? 'paused' : 'normal' });
  });

  ipcMain.on('alert:show', (_e, data) => { system.log('alert:show', data.title); try { showAlert(data); } catch (e) { system.log('alert error', e); } });
  ipcMain.on('tray:update', (_e, state) => system.updateTray(state));
  ipcMain.on('app:quit', () => quitApp());
  ipcMain.on('log', (_e, msg) => system.log('renderer', msg));
  ipcMain.on('alert:close', () => closeAlert());
  ipcMain.on('alert:action', (_e, action) => {
    closeAlert();
    if (win && !win.isDestroyed()) win.webContents.send('alert-action', action);
  });

  ipcMain.on('title', (_e, title) => { if (win) win.setTitle(title); });

  ipcMain.on('theme', (_e, theme) => {
    if (!win) return;
    const c = THEMES[resolveTheme(theme)];
    win.setBackgroundColor(c.bg);
    try { win.setTitleBarOverlay({ color: c.bg, symbolColor: c.symbol, height: 40 }); } catch {}
  });

  ipcMain.handle('system-dark', () => nativeTheme.shouldUseDarkColors);
  nativeTheme.on('updated', () => {
    if (win) win.webContents.send('system-theme-changed', nativeTheme.shouldUseDarkColors);
  });

  ipcMain.on('always-on-top', (_e, on) => { if (win) win.setAlwaysOnTop(!!on); });

  ipcMain.on('focus-window', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });

  ipcMain.handle('export-csv', async (_e, { csv, name }) => {
    const r = await dialog.showSaveDialog(win, {
      defaultPath: path.join(app.getPath('documents'), name),
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    });
    if (r.canceled || !r.filePath) return false;
    fs.writeFileSync(r.filePath, '﻿' + csv, 'utf8');
    return true;
  });

  ipcMain.on('open-data-folder', () => shell.openPath(dataDir()));

  createWindow();
  system.createTray({
    show: showWindow,
    toggleWindow: () => { if (win && win.isVisible() && !win.isMinimized()) win.hide(); else showWindow(); },
    action: (a) => { if (win) win.webContents.send('tray-action', a); },
    quit: quitApp,
  });
  system.log('started', app.getVersion(), process.execPath);
  setupUpdates();
});

// Self-update from GitHub Releases (installed build only). Downloads quietly, installs on next quit.
function setupUpdates() {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch (e) { system.log('updater missing', e); return; }
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('error', (e) => system.log('update error', e));
  autoUpdater.on('update-downloaded', (info) => {
    system.log('update downloaded', info.version);
    if (win && !win.isDestroyed()) win.webContents.send('update-ready', info.version);
  });
  ipcMain.on('update:install', () => { quitting = true; autoUpdater.quitAndInstall(false, true); });
  const check = () => autoUpdater.checkForUpdates().catch((e) => system.log('update check', e));
  setTimeout(check, 5000);
  setInterval(check, 6 * 60 * 60 * 1000);
}

app.on('before-quit', () => { quitting = true; closeAlert(); system.destroyTray(); });
app.on('window-all-closed', () => app.quit());
