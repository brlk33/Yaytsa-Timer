'use strict';

/* ================= i18n ================= */
const I18N = {
  ru: {
    appName: 'Яйца Таймер', updReady: v => `Версия ${v} загружена`, updNow: 'Перезапустить',
    tabTimer: 'Таймер', tabStats: 'Статистика', tabSettings: 'Настройки',
    work: 'Работа', break: 'Перерыв', today: 'Сегодня',
    start: 'Старт', pause: 'Пауза', resume: 'Продолжить',
    reset: 'Сбросить', skip: 'Пропустить этап',
    labelPh: 'Над чем работаете?',
    session: n => `Сессия ${n}`, paused: 'пауза',
    hint: '<kbd>Пробел</kbd> старт / пауза · <kbd>R</kbd> сброс · <kbd>S</kbd> пропуск',
    last7: '7 дней', last30: '30 дней', goal: 'Цель на сегодня',
    byDay: 'По дням', history: 'История', exportCsv: 'Экспорт CSV', showMore: 'Показать ещё',
    noData: 'Здесь появятся ваши рабочие сессии',
    noLabel: 'Без названия', yesterday: 'Вчера',
    gTimer: 'Таймер', gNotify: 'Сигналы', gLook: 'Внешний вид', gData: 'Данные',
    workLen: 'Рабочий заход', breakLen: 'Перерыв', stepDesc: 'Шаг — 5 минут',
    autoStart: 'Автозапуск', autoStartDesc: 'Сразу начинать следующий этап',
    goalSet: 'Цель на день', goalDesc: 'Часов работы в день',
    sound: 'Звук', notifications: 'Уведомления', notifDesc: 'Системное уведомление в конце этапа',
    language: 'Язык', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', system: 'Системная',
    onTop: 'Поверх всех окон',
    dataName: 'Учёт времени', dataDesc: 'Экспорт истории или папка с файлом данных',
    openFolder: 'Открыть папку',
    nBreakTitle: 'Время перерыва', nBreakBody: m => `Рабочий заход завершён. Отдохните ${m} мин.`,
    nWorkTitle: 'За работу', nWorkBody: m => `Перерыв окончен. Следующий заход — ${m} мин.`,
    test: 'Тест 5 сек', testIn: n => `Тест… ${n}`, testToast: 'Через 5 секунд появится напоминание',
    testTitle: 'Тест напоминания', closeToTray: 'Сворачивать в трей', closeToTrayDesc: 'Крестик прячет окно в трей, таймер продолжает идти',
    trayOpen: 'Открыть Яйца Таймер', trayQuit: 'Выйти', trayTest: 'Тест напоминания (5 сек)',
    popup: 'Окно поверх всего', popupDesc: 'Справа снизу, поверх игр и видео. Не исчезает, пока не нажмёте',
    goBreak: 'Начать перерыв', goWork: 'Начать работу', later: 'Закрыть', gotIt: 'Понятно',
    aBreakBody: (w, b) => `Рабочий заход ${w}\u00a0мин завершён. Перерыв\u00a0—\u00a0${b}\u00a0мин.`,
    aWorkBody: w => `Перерыв окончен. Следующий заход\u00a0—\u00a0${w}\u00a0мин.`,
    aBreakAuto: b => `Перерыв ${b}\u00a0мин уже идёт.`,
    aWorkAuto: w => `Рабочий заход ${w}\u00a0мин уже идёт.`,
    off: 'выкл', exported: 'Файл сохранён', deleted: 'Запись удалена', undo: 'Отменить',
    min: 'мин', h: 'ч',
    days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    csvHead: 'Дата;Начало;Конец;Минуты;Задача',
  },
  en: {
    appName: 'Yaytsa Timer', updReady: v => `Version ${v} downloaded`, updNow: 'Restart',
    tabTimer: 'Timer', tabStats: 'Stats', tabSettings: 'Settings',
    work: 'Focus', break: 'Break', today: 'Today',
    start: 'Start', pause: 'Pause', resume: 'Resume',
    reset: 'Reset', skip: 'Skip phase',
    labelPh: 'What are you working on?',
    session: n => `Session ${n}`, paused: 'paused',
    hint: '<kbd>Space</kbd> start / pause · <kbd>R</kbd> reset · <kbd>S</kbd> skip',
    last7: 'Last 7 days', last30: 'Last 30 days', goal: 'Today’s goal',
    byDay: 'By day', history: 'History', exportCsv: 'Export CSV', showMore: 'Show more',
    noData: 'Your focus sessions will show up here',
    noLabel: 'Untitled', yesterday: 'Yesterday',
    gTimer: 'Timer', gNotify: 'Alerts', gLook: 'Appearance', gData: 'Data',
    workLen: 'Focus length', breakLen: 'Break length', stepDesc: '5-minute steps',
    autoStart: 'Auto-start', autoStartDesc: 'Start the next phase automatically',
    goalSet: 'Daily goal', goalDesc: 'Hours of focus per day',
    sound: 'Sound', notifications: 'Notifications', notifDesc: 'System notification when a phase ends',
    language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', system: 'System',
    onTop: 'Always on top',
    dataName: 'Time log', dataDesc: 'Export history or open the data folder',
    openFolder: 'Open folder',
    nBreakTitle: 'Break time', nBreakBody: m => `Focus session done. Rest for ${m} min.`,
    nWorkTitle: 'Back to work', nWorkBody: m => `Break is over. Next session — ${m} min.`,
    test: 'Test 5 sec', testIn: n => `Test… ${n}`, testToast: 'The reminder will pop up in 5 seconds',
    testTitle: 'Reminder test', closeToTray: 'Close to tray', closeToTrayDesc: 'The close button hides the window to the tray; the timer keeps running',
    trayOpen: 'Open Yaytsa Timer', trayQuit: 'Quit', trayTest: 'Test reminder (5 sec)',
    popup: 'Pop-up over everything', popupDesc: 'Bottom-right, over games and videos. Stays until you click it',
    goBreak: 'Start break', goWork: 'Start focus', later: 'Close', gotIt: 'Got it',
    aBreakBody: (w, b) => `${w}\u2011min focus session done. Break\u00a0—\u00a0${b} min.`,
    aWorkBody: w => `Break is over. Next session\u00a0—\u00a0${w} min.`,
    aBreakAuto: b => `Your ${b}\u2011min break has started.`,
    aWorkAuto: w => `Your ${w}\u2011min focus session has started.`,
    off: 'off', exported: 'File saved', deleted: 'Entry deleted', undo: 'Undo',
    min: 'min', h: 'h',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    csvHead: 'Date,Start,End,Minutes,Task',
  },
};

/* ================= State ================= */
const api = window.focusApi;
const DEFAULTS = {
  work: 25, brk: 5, autoStart: false, sound: true, notify: true,
  lang: 'ru', theme: 'dark', goal: 4, alwaysOnTop: false, popup: true, closeToTray: true,
};
const LIMITS = {
  work: { min: 5, max: 180, step: 5 },
  brk: { min: 5, max: 60, step: 5 },
  goal: { min: 0, max: 12, step: 0.5 },
};

let settings = { ...DEFAULTS };
let sessions = [];       // {id, start, end, dur(sec), label}
let systemDark = true;

const timer = {
  phase: 'work',         // 'work' | 'break'
  total: 25 * 60000,
  remaining: 25 * 60000,
  running: false,
  endAt: 0,
  startedAt: 0,          // first start of the current work phase
};

let view = 'timer';
let historyLimit = 7;    // days shown in history
let chartRange = 7;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const t = k => I18N[settings.lang][k];

/* ================= Persistence ================= */
let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    api.save({ settings, sessions, current: { label: $('#label').value } });
  }, 250);
}
function persistNow() {
  clearTimeout(saveTimer);
  return api.save({ settings, sessions, current: { label: $('#label').value } });
}

/* ================= Formatting ================= */
const pad = n => String(n).padStart(2, '0');
function fmtClock(ms) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
function fmtDur(sec) {
  const m = Math.round(sec / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h === 0) return `${mm} ${t('min')}`;
  if (mm === 0) return `${h} ${t('h')}`;
  return `${h} ${t('h')} ${mm} ${t('min')}`;
}
function fmtMinutes(m) { return m >= 60 && m % 60 === 0 ? `${m / 60} ${t('h')}` : (m >= 60 ? `${Math.floor(m / 60)} ${t('h')} ${m % 60} ${t('min')}` : `${m} ${t('min')}`); }
function fmtHours(h) {
  if (h === 0) return t('off');
  const s = Number.isInteger(h) ? String(h) : String(h).replace('.', settings.lang === 'ru' ? ',' : '.');
  return `${s} ${t('h')}`;
}
const hm = ts => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dayKey = ts => { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const startOfDay = (ts = Date.now()) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
function dayTitle(ts) {
  const today = startOfDay();
  const day = startOfDay(ts);
  if (day === today) return t('today');
  if (day === today - 86400000 || Math.round((today - day) / 86400000) === 1) return t('yesterday');
  const d = new Date(ts);
  return settings.lang === 'ru'
    ? `${t('days')[d.getDay()]}, ${d.getDate()} ${t('months')[d.getMonth()]}`
    : `${t('days')[d.getDay()]}, ${t('months')[d.getMonth()]} ${d.getDate()}`;
}

/* ================= Aggregates ================= */
function secondsSince(fromTs) {
  return sessions.reduce((acc, s) => acc + (s.start >= fromTs ? s.dur : 0), 0);
}
function liveWorkSec() {
  // time of the current, not yet logged work phase
  if (timer.phase !== 'work' || !timer.startedAt) return 0;
  return Math.max(0, Math.floor((timer.total - currentRemaining()) / 1000));
}
const todaySec = () => secondsSince(startOfDay()) + liveWorkSec();
function completedToday() {
  const from = startOfDay();
  return sessions.filter(s => s.start >= from && s.full).length;
}

/* ================= Sound ================= */
let audioCtx = null;
function chime(kind) {
  if (!settings.sound) return;
  try {
    audioCtx = audioCtx || new AudioContext();
    const now = audioCtx.currentTime;
    const notes = kind === 'work' ? [659.25, 880, 1318.5] : [880, 659.25, 523.25];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      const t0 = now + i * 0.18;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      o.connect(g).connect(audioCtx.destination);
      o.start(t0);
      o.stop(t0 + 1.2);
    });
  } catch {}
}

/* ================= Timer logic ================= */
const phaseMinutes = p => (p === 'work' ? settings.work : settings.brk);
function currentRemaining() {
  return timer.running ? Math.max(0, timer.endAt - Date.now()) : timer.remaining;
}
const isUntouched = () => !timer.running && timer.remaining === timer.total;

function setPhase(phase) {
  timer.phase = phase;
  timer.total = phaseMinutes(phase) * 60000;
  timer.remaining = timer.total;
  timer.running = false;
  timer.startedAt = 0;
}

function start() {
  if (timer.running) return;
  if (timer.phase === 'work' && !timer.startedAt) timer.startedAt = Date.now();
  timer.endAt = Date.now() + timer.remaining;
  timer.running = true;
  api.closeAlert();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  render();
}
function pause() {
  if (!timer.running) return;
  timer.remaining = Math.max(0, timer.endAt - Date.now());
  timer.running = false;
  render();
}
const toggle = () => (timer.running ? pause() : start());

function logWork(full, sync) {
  const elapsedMs = timer.total - currentRemaining();
  const dur = Math.round(elapsedMs / 1000);
  if (!full && dur < 60) return; // ignore accidental starts
  sessions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    start: timer.startedAt || (Date.now() - elapsedMs),
    end: Date.now(),
    dur,
    label: $('#label').value.trim(),
    full: !!full,
  });
  if (sync) api.saveSync({ settings, sessions, current: { label: $('#label').value } });
  else persistNow();
}

function complete() {
  const finished = timer.phase;
  if (finished === 'work') logWork(true);
  setPhase(finished === 'work' ? 'break' : 'work');
  if (settings.autoStart) start();
  alertPhaseEnd(finished);
  render();
}

let alertIsTest = false;
function alertPhaseEnd(finished, test) {
  alertIsTest = !!test;
  const next = finished === 'work' ? 'break' : 'work';
  const auto = test ? false : settings.autoStart;
  const title = test ? t('testTitle') : (next === 'break' ? t('nBreakTitle') : t('nWorkTitle'));
  if (settings.popup || test) {
    api.showAlert({
      next, title,
      body: auto
        ? (next === 'break' ? t('aBreakAuto')(settings.brk) : t('aWorkAuto')(settings.work))
        : (next === 'break' ? t('aBreakBody')(settings.work, settings.brk) : t('aWorkBody')(settings.work)),
      goLabel: next === 'break' ? t('goBreak') : t('goWork'),
      okLabel: auto ? t('gotIt') : t('later'),
      hideGo: auto,
      sound: settings.sound,
      repeatSec: 15,
      theme: effectiveTheme(),
      lang: settings.lang,
    });
  } else {
    chime(next);
    if (settings.notify) {
      api.notify(title, next === 'break' ? t('nBreakBody')(settings.brk) : t('nWorkBody')(settings.work));
    }
  }
}

let testTimer = null;
function runTest() {
  if (testTimer) return;
  api.closeAlert();
  toast(t('testToast'));
  let n = 5;
  const btn = $('#btnTest');
  btn.textContent = t('testIn')(n);
  btn.disabled = true;
  testTimer = setInterval(() => {
    n -= 1;
    if (n > 0) { btn.textContent = t('testIn')(n); return; }
    clearInterval(testTimer);
    testTimer = null;
    btn.textContent = t('test');
    btn.disabled = false;
    alertPhaseEnd('work', true);
  }, 1000);
}

let lastTray = '';
function syncTray() {
  const rem = currentRemaining();
  const touched = !isUntouched();
  const phase = timer.phase === 'work' ? t('work') : t('break');
  const tooltip = touched ? `${t('appName')} — ${fmtClock(rem)} · ${phase}` : `${t('appName')} — ${phase} ${fmtClock(rem)}`;
  const state = {
    running: timer.running,
    tooltip,
    labels: { open: t('trayOpen'), start: touched ? t('resume') : t('start'), pause: t('pause'), test: t('trayTest'), quit: t('trayQuit') },
  };
  const key = JSON.stringify(state);
  if (key !== lastTray) { lastTray = key; api.updateTray(state); }
}

function skip() {
  api.closeAlert();
  if (timer.phase === 'work' && timer.startedAt) logWork(false);
  setPhase(timer.phase === 'work' ? 'break' : 'work');
  if (settings.autoStart) start();
  render();
}

function reset() {
  api.closeAlert();
  if (timer.phase === 'work' && timer.startedAt) logWork(false);
  setPhase(timer.phase);
  render();
}

function tick() {
  if (timer.running && Date.now() >= timer.endAt) {
    timer.remaining = 0;
    complete();
    return;
  }
  renderTimer();
}

/* ================= Rendering ================= */
let lastTitle = '';
function renderTimer() {
  const rem = currentRemaining();
  const isWork = timer.phase === 'work';
  const touched = !isUntouched();

  $('#time').textContent = fmtClock(rem);
  $('#time').classList.toggle('paused', touched && !timer.running);

  const tag = $('#phaseTag');
  tag.textContent = isWork ? t('work') : t('break');
  tag.classList.toggle('break', !isWork);

  let info = t('session')(completedToday() + (isWork ? 1 : 0));
  if (touched && !timer.running) info += ` · ${t('paused')}`;
  $('#cycleInfo').textContent = info;

  const ratio = timer.total ? 1 - rem / timer.total : 0;
  const fill = $('#barFill');
  fill.style.width = `${(ratio * 100).toFixed(2)}%`;
  fill.classList.toggle('break', !isWork);

  const btn = $('#btnStart');
  btn.textContent = timer.running ? t('pause') : (touched ? t('resume') : t('start'));
  btn.classList.toggle('secondary', timer.running);

  const goalH = settings.goal;
  const tSec = todaySec();
  $('#todayVal').textContent = goalH > 0 ? `${fmtDur(tSec)} / ${fmtHours(goalH)}` : fmtDur(tSec);

  // Window title and taskbar progress
  const title = touched ? `${fmtClock(rem)} · ${isWork ? t('work') : t('break')} — ${t('appName')}` : t('appName');
  if (title !== lastTitle) { api.title(title); lastTitle = title; }
  api.progress(touched ? Math.min(1, Math.max(0.001, ratio)) : -1, touched && !timer.running);
  syncTray();
}

function renderSteppers() {
  $$('.stepper').forEach(el => {
    const key = el.dataset.key;
    const lim = LIMITS[key];
    const v = settings[key];
    const label = key === 'goal' ? fmtHours(v) : fmtMinutes(v);
    if (!el.firstChild) {
      el.innerHTML = '<button class="dec" aria-label="−">−</button><span class="val"></span><button class="inc" aria-label="+">+</button>';
      el.querySelector('.dec').addEventListener('click', () => changeSetting(key, -1));
      el.querySelector('.inc').addEventListener('click', () => changeSetting(key, +1));
    }
    el.querySelector('.val').textContent = label;
    el.querySelector('.dec').disabled = v <= lim.min;
    el.querySelector('.inc').disabled = v >= lim.max;
  });
}

function renderControls() {
  $$('.toggle').forEach(el => el.classList.toggle('on', !!settings[el.dataset.key]));
  $$('.seg[data-key]').forEach(seg => {
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.val === settings[seg.dataset.key]));
  });
  $$('#chartRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.range) === chartRange));
}

function applyI18n() {
  document.documentElement.lang = settings.lang;
  $$('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (el.dataset.i18n === 'hint') el.innerHTML = v; else el.textContent = v;
  });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}

function effectiveTheme() {
  return settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;
}
function applyTheme() {
  document.documentElement.dataset.theme = effectiveTheme();
  api.theme(settings.theme);
}

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderStats() {
  const now = Date.now();
  const today0 = startOfDay();
  const live = liveWorkSec();
  $('#stToday').textContent = fmtDur(todaySec());
  $('#stWeek').textContent = fmtDur(secondsSince(today0 - 6 * 86400000) + live);
  $('#stMonth').textContent = fmtDur(secondsSince(today0 - 29 * 86400000) + live);

  // goal
  const goalSec = settings.goal * 3600;
  $('#goalBlock').style.display = goalSec > 0 ? '' : 'none';
  if (goalSec > 0) {
    const done = todaySec();
    const pct = Math.min(100, (done / goalSec) * 100);
    $('#goalFill').style.width = `${pct}%`;
    $('#goalText').textContent = `${fmtDur(done)} / ${fmtHours(settings.goal)} · ${Math.round((done / goalSec) * 100)}%`;
  }

  // chart
  const days = [];
  for (let i = chartRange - 1; i >= 0; i--) {
    const d0 = new Date(today0); d0.setDate(d0.getDate() - i);
    days.push({ ts: d0.getTime(), key: dayKey(d0.getTime()), sec: 0 });
  }
  const byKey = Object.fromEntries(days.map(d => [d.key, d]));
  sessions.forEach(s => { const d = byKey[dayKey(s.start)]; if (d) d.sec += s.dur; });
  days[days.length - 1].sec += live;
  const maxSec = Math.max(goalSec, ...days.map(d => d.sec), 3600);
  const chart = $('#chart');
  const labelEvery = chartRange <= 7 ? 1 : chartRange <= 14 ? 2 : 5;
  chart.innerHTML = days.map((d, i) => {
    const h = (d.sec / maxSec) * 100;
    const dt = new Date(d.ts);
    const isToday = d.ts === today0;
    const lbl = chartRange <= 7 ? t('days')[dt.getDay()] : String(dt.getDate());
    const showLbl = (days.length - 1 - i) % labelEvery === 0;
    return `<div class="col${isToday ? ' today' : ''}">
      <div class="tip">${esc(dayTitle(d.ts))} · ${fmtDur(d.sec)}</div>
      <div class="b${d.sec < 30 ? ' zero' : ''}" style="height:${h.toFixed(1)}%"></div>
      ${showLbl ? `<div class="lbl">${lbl}</div>` : ''}
    </div>`;
  }).join('') + (goalSec > 0 ? '<div class="goal-line"></div>' : '');
  // place goal line precisely
  const gl = chart.querySelector('.goal-line');
  if (gl) {
    const inner = chart.clientHeight - 20;
    gl.style.bottom = `${20 + (goalSec / maxSec) * inner}px`;
  }

  // history
  const hist = $('#history');
  if (!sessions.length) {
    hist.innerHTML = `<div class="empty-state">${t('noData')}</div>`;
    $('#btnMore').style.display = 'none';
    return;
  }
  const groups = new Map();
  [...sessions].sort((a, b) => b.start - a.start).forEach(s => {
    const k = dayKey(s.start);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  });
  const keys = [...groups.keys()];
  const shown = keys.slice(0, historyLimit);
  hist.innerHTML = shown.map(k => {
    const list = groups.get(k);
    const total = list.reduce((a, s) => a + s.dur, 0);
    return `<div class="day-head"><span>${esc(dayTitle(list[0].start))}</span><span>${fmtDur(total)}</span></div>` +
      list.map(s => `<div class="row">
        <span class="r-time">${hm(s.start)}–${hm(s.end)}</span>
        <span class="r-label${s.label ? '' : ' empty'}">${esc(s.label || t('noLabel'))}</span>
        <span class="r-dur">${fmtDur(s.dur)}</span>
        <button class="del" data-id="${s.id}" title="×"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
      </div>`).join('');
  }).join('');
  $('#btnMore').style.display = keys.length > historyLimit ? '' : 'none';
  void now;
}

function render() {
  renderTimer();
  renderSteppers();
  renderControls();
  if (view === 'stats') renderStats();
}

/* ================= Settings changes ================= */
function changeSetting(key, dir) {
  const lim = LIMITS[key];
  const v = Math.round((settings[key] + dir * lim.step) * 10) / 10;
  settings[key] = Math.min(lim.max, Math.max(lim.min, v));
  if ((key === 'work' && timer.phase === 'work') || (key === 'brk' && timer.phase === 'break')) {
    if (isUntouched()) setPhase(timer.phase);
  }
  persist();
  render();
}

function setValue(key, val) {
  settings[key] = val;
  if (key === 'lang') applyI18n();
  if (key === 'theme') applyTheme();
  if (key === 'alwaysOnTop') api.alwaysOnTop(val);
  persist();
  render();
}

/* ================= Toast ================= */
let toastT = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ================= CSV ================= */
async function exportCsv() {
  const ru = settings.lang === 'ru';
  const sep = ru ? ';' : ',';
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [t('csvHead')];
  [...sessions].sort((a, b) => a.start - b.start).forEach(s => {
    const mins = (s.dur / 60).toFixed(1);
    lines.push([dayKey(s.start), hm(s.start), hm(s.end), ru ? mins.replace('.', ',') : mins, q(s.label || '')].join(sep));
  });
  const ok = await api.exportCsv(lines.join('\r\n'), `yaytsa-timer-${dayKey(Date.now())}.csv`);
  if (ok) toast(t('exported'));
}

/* ================= Events ================= */
function bind() {
  $$('.tab').forEach(b => b.addEventListener('click', () => {
    view = b.dataset.view;
    $$('.tab').forEach(x => x.classList.toggle('active', x === b));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
    if (view === 'stats') { historyLimit = 7; renderStats(); }
  }));

  $('#btnStart').addEventListener('click', toggle);
  $('#btnReset').addEventListener('click', reset);
  $('#btnSkip').addEventListener('click', skip);
  $('#label').addEventListener('input', persist);
  $('#label').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });

  $$('.toggle').forEach(el => el.addEventListener('click', () => setValue(el.dataset.key, !settings[el.dataset.key])));
  $$('.seg[data-key] button').forEach(b => b.addEventListener('click', () => setValue(b.closest('.seg').dataset.key, b.dataset.val)));
  $$('#chartRange button').forEach(b => b.addEventListener('click', () => { chartRange = Number(b.dataset.range); renderControls(); renderStats(); }));

  $('#history').addEventListener('click', e => {
    const btn = e.target.closest('.del');
    if (!btn) return;
    sessions = sessions.filter(s => s.id !== btn.dataset.id);
    persistNow();
    renderStats();
    renderTimer();
    toast(t('deleted'));
  });
  $('#btnMore').addEventListener('click', () => { historyLimit += 14; renderStats(); });
  $('#btnExport').addEventListener('click', exportCsv);
  $('#btnExport2').addEventListener('click', exportCsv);
  $('#btnFolder').addEventListener('click', () => api.openDataFolder());

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.code === 'KeyR') reset();
    else if (e.code === 'KeyS') skip();
    else if (e.code === 'Digit1') $$('.tab')[0].click();
    else if (e.code === 'Digit2') $$('.tab')[1].click();
    else if (e.code === 'Digit3') $$('.tab')[2].click();
  });

  api.onAlertAction(action => {
    if (alertIsTest) { alertIsTest = false; return; }
    if (action === 'start' && !timer.running) start();
  });
  api.onUpdateReady(v => {
    const el = $('#update');
    el.querySelector('span').textContent = t('updReady')(v);
    el.querySelector('button').textContent = t('updNow');
    el.hidden = false;
  });
  $('#update button').addEventListener('click', () => api.installUpdate());
  api.onTrayAction(a => {
    if (a === 'toggle') toggle();
    else if (a === 'test') runTest();
  });
  $('#btnTest').addEventListener('click', runTest);
  $('#btnTest2').addEventListener('click', runTest);
  window.addEventListener('error', e => api.log(String(e.message)));

  api.onSystemTheme(dark => { systemDark = dark; if (settings.theme === 'system') applyTheme(); });

  // Called by the host right before quitting
  window.__beforeQuit = () => {
    if (timer.phase === 'work' && timer.startedAt) logWork(false, true);
    else api.saveSync({ settings, sessions, current: { label: $('#label').value } });
  };
  // Log an in-progress work session if the app is closed mid-session
  window.addEventListener('beforeunload', () => {
    if (timer.phase === 'work' && timer.startedAt) logWork(false, true);
    else api.saveSync({ settings, sessions, current: { label: $('#label').value } });
  });

  // Refresh stats around midnight / while visible
  setInterval(() => { if (view === 'stats') renderStats(); }, 15000);
}

/* ================= Boot ================= */
(async function boot() {
  const data = (await api.load()) || {};
  settings = { ...DEFAULTS, ...(data.settings || {}) };
  sessions = Array.isArray(data.sessions) ? data.sessions : [];
  systemDark = await api.systemDark();
  if (data.current && data.current.label) $('#label').value = data.current.label;

  applyTheme();
  applyI18n();
  setPhase('work');
  bind();
  render();
  setInterval(tick, 250);
})();
