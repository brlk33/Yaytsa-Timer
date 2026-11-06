// Tray icon and log file.
const { app, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'Яйца Таймер';

function log(...a) {
  try {
    fs.appendFileSync(path.join(app.getPath('userData'), 'yaytsa-timer.log'),
      `[${new Date().toISOString()}] ${a.map(x => (x instanceof Error ? x.stack : typeof x === 'string' ? x : JSON.stringify(x))).join(' ')}\n`);
  } catch {}
}

let tray = null;
let trayState = { labels: {}, running: false, tooltip: APP_NAME };
let handlers = {};

function buildMenu() {
  const L = trayState.labels;
  return Menu.buildFromTemplate([
    { label: L.open || `Открыть ${APP_NAME}`, click: handlers.show },
    { label: trayState.running ? (L.pause || 'Пауза') : (L.start || 'Старт'), click: () => handlers.action('toggle') },
    { label: L.test || 'Тест напоминания (5 сек)', click: () => handlers.action('test') },
    { type: 'separator' },
    { label: L.quit || 'Выйти', click: handlers.quit },
  ]);
}

function createTray(h) {
  handlers = h;
  let img = nativeImage.createFromPath(path.join(__dirname, 'icon.ico'));
  if (img.isEmpty()) img = nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({ width: 16, height: 16 });
  tray = new Tray(img);
  tray.setToolTip(APP_NAME);
  tray.setContextMenu(buildMenu());
  tray.on('click', handlers.toggleWindow);
  tray.on('double-click', handlers.show);
  return tray;
}

function updateTray(state) {
  if (!tray) return;
  const changed = state.running !== trayState.running || JSON.stringify(state.labels) !== JSON.stringify(trayState.labels);
  trayState = { ...trayState, ...state };
  tray.setToolTip(trayState.tooltip || APP_NAME);
  if (changed) tray.setContextMenu(buildMenu());
}

function destroyTray() { if (tray) { tray.destroy(); tray = null; } }

module.exports = { APP_NAME, createTray, updateTray, destroyTray, log };
