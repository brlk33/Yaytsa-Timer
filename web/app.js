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
    tabProjects: 'Проекты', tabApps: 'Программы',
    projLead: 'Проект — это название в поле «Над чем работаете?». Время каждого захода засчитывается в его проект.',
    projNewPh: 'Новый проект', add: 'Добавить', done: 'Готово',
    projEmpty: 'Напишите на вкладке «Таймер», над чем работаете, или добавьте проект здесь',
    pTotal: 'Всего', pWeek: '7 дней', pToday: 'Сегодня', pSessions: n => `${n} ${plural(n, 'заход', 'захода', 'заходов')}`,
    deadline: 'Дедлайн', addDeadline: '+ Дедлайн', clearDeadline: 'Убрать дедлайн',
    dlLeft: n => `через ${n} ${plural(n, 'день', 'дня', 'дней')}`, dlToday: 'сегодня', dlTomorrow: 'завтра',
    dlOver: n => `просрочен на ${n} ${plural(n, 'день', 'дня', 'дней')}`,
    workOn: 'Работать над этим', rename: 'Переименовать', hide: 'Скрыть', unhide: 'Вернуть',
    hiddenN: n => `Скрытые проекты (${n})`, hideHidden: 'Свернуть скрытые', current: 'сейчас',
    appsLead: 'Как в Steam: время идёт, пока программа открыта. «Активно» — когда её окно на переднем плане, а вы за компьютером.',
    appsAdd: '+ Добавить программу', appsPick: 'Открыты сейчас', appsNone: 'Пока ничего не отслеживается',
    appsNoCand: 'Откройте нужную программу, и она появится в этом списке', running: 'запущена',
    aToday: 'Сегодня', aWeek: '7 дней', aTotal: 'Всего', aActive: 'активно', stopTrack: 'Не отслеживать',
    gSystem: 'Система', launchAtStart: 'Запускать вместе с Windows', launchAtStartDesc: 'Стартует свёрнутой в трей',
scale: 'Масштаб', appsPickTitle: 'Добавить программу', appsSearchPh: 'Поиск по программам на компьютере', appsBrowse: 'Выбрать .exe вручную…', appsBrowseTitle: 'Выберите программу',    appsFound: 'Найдено', appsAll: 'Все программы', appsNothing: 'Ничего не нашлось. Попробуйте выбрать .exe вручную', appsAdded: n => `«${n}» отслеживается`,    r3m: '3 мес', r6m: '6 мес', r1y: 'Год', modeBars: 'Столбики', modeSquares: 'Квадратики',    monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],    daysMon: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], noWork: 'без работы',    activeDays: n => `${n} ${plural(n, 'рабочий день', 'рабочих дня', 'рабочих дней')}`, streak: n => `серия ${n} ${plural(n, 'день', 'дня', 'дней')} подряд`,    less: 'Меньше', more: 'Больше', byHour: 'По часам за неделю',
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
    tabProjects: 'Projects', tabApps: 'Apps',
    projLead: 'A project is the name in “What are you working on?”. Every focus session counts toward its project.',
    projNewPh: 'New project', add: 'Add', done: 'Done',
    projEmpty: 'Type what you’re working on in the Timer tab, or add a project here',
    pTotal: 'Total', pWeek: '7 days', pToday: 'Today', pSessions: n => `${n} session${n === 1 ? '' : 's'}`,
    deadline: 'Deadline', addDeadline: '+ Deadline', clearDeadline: 'Remove deadline',
    dlLeft: n => `in ${n} day${n === 1 ? '' : 's'}`, dlToday: 'today', dlTomorrow: 'tomorrow',
    dlOver: n => `${n} day${n === 1 ? '' : 's'} overdue`,
    workOn: 'Work on this', rename: 'Rename', hide: 'Hide', unhide: 'Restore',
    hiddenN: n => `Hidden projects (${n})`, hideHidden: 'Collapse hidden', current: 'now',
    appsLead: 'Like Steam: time counts while the program is open. “Active” is when its window is in front and you’re at the PC.',
    appsAdd: '+ Add a program', appsPick: 'Open right now', appsNone: 'Nothing is tracked yet',
    appsNoCand: 'Open the program you want and it will show up here', running: 'running',
    aToday: 'Today', aWeek: '7 days', aTotal: 'Total', aActive: 'active', stopTrack: 'Stop tracking',
    gSystem: 'System', launchAtStart: 'Launch with Windows', launchAtStartDesc: 'Starts hidden in the tray',
scale: 'Zoom', appsPickTitle: 'Add a program', appsSearchPh: 'Search programs on this PC', appsBrowse: 'Pick an .exe manually…', appsBrowseTitle: 'Choose a program',    appsFound: 'Found', appsAll: 'All programs', appsNothing: 'Nothing found. Try picking the .exe manually', appsAdded: n => `Tracking “${n}”`,    r3m: '3 mo', r6m: '6 mo', r1y: 'Year', modeBars: 'Bars', modeSquares: 'Squares',    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],    daysMon: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], noWork: 'no focus',    activeDays: n => `${n} active day${n === 1 ? '' : 's'}`, streak: n => `${n}-day streak`,    less: 'Less', more: 'More', byHour: 'By hour, last 7 days',
  },
};

function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

/* ================= State ================= */
const api = window.focusApi;
const DEFAULTS = {
  work: 25, brk: 5, autoStart: false, sound: true, notify: true,
  lang: 'ru', theme: 'dark', goal: 4, alwaysOnTop: false, popup: true, closeToTray: true,
  zoom: 1, chartMode: 'bars', heatRange: 26,
};
const ZOOM = { min: 0.7, max: 1.6, step: 0.1 };
const LIMITS = {
  work: { min: 5, max: 180, step: 5 },
  brk: { min: 5, max: 60, step: 5 },
  goal: { min: 0, max: 12, step: 0.5 },
};

let settings = { ...DEFAULTS };
let sessions = [];       // {id, start, end, dur(sec), label}
// Project metadata keyed by projKey(name). Projects themselves come from session labels;
// this only stores what labels can't: deadline, hidden flag, projects added before any work.
let projects = {};       // {key: {name, deadline: 'YYYY-MM-DD'|'', hidden, created}}
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
const snapshot = () => ({ settings, sessions, projects, current: { label: $('#label').value } });
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    api.save(snapshot());
  }, 250);
}
function persistNow() {
  clearTimeout(saveTimer);
  return api.save(snapshot());
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
  if (api.schedule) api.schedule(0);
}

function start() {
  if (timer.running) return;
  if (timer.phase === 'work' && !timer.startedAt) timer.startedAt = Date.now();
  timer.endAt = Date.now() + timer.remaining;
  timer.running = true;
  api.schedule(timer.remaining);
  api.closeAlert();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  render();
}
function pause() {
  if (!timer.running) return;
  timer.remaining = Math.max(0, timer.endAt - Date.now());
  timer.running = false;
  api.schedule(0);
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
  if (sync) api.saveSync(snapshot());
  else persistNow();
  updateDatalist();
  renderLabelMeta();
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
let lastProg = '';
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
  const prog = touched ? Math.min(1, Math.max(0.001, ratio)).toFixed(3) : '-1';
  const progKey = `${prog}|${touched && !timer.running}`;
  if (progKey !== lastProg) { lastProg = progKey; api.progress(Number(prog), touched && !timer.running); }
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
  $$('.toggle[data-key]').forEach(el => el.classList.toggle('on', !!settings[el.dataset.key]));
  $$('.seg[data-key]').forEach(seg => {
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.val === settings[seg.dataset.key]));
  });
  $$('#chartRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.range) === chartRange));
  $$('#heatRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.range) === settings.heatRange));
  $$('#chartMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === settings.chartMode));
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

  const squares = settings.chartMode === 'squares';
  $('#chart').hidden = squares;
  $('#heat').hidden = !squares;
  $('#chartRange').hidden = squares;
  $('#heatRange').hidden = !squares;
  if (squares) renderHeat(); else renderBars(today0, goalSec, live);
  renderHistory();
}

/* ---------- Activity heatmap (GitHub-style squares) ---------- */
function addDays(ts, n) { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); }

function workByDay() {
  const m = new Map();
  sessions.forEach(s => { const k = dayKey(s.start); m.set(k, (m.get(k) || 0) + s.dur); });
  const live = liveWorkSec();
  if (live) { const k = dayKey(Date.now()); m.set(k, (m.get(k) || 0) + live); }
  return m;
}

// 0 = no work (neutral, never red), 1..4 = more and more green.
function dayLevel(sec, maxSec) {
  if (sec < 60) return 0;
  const goal = settings.goal * 3600;
  const r = goal > 0 ? sec / goal : sec / Math.max(maxSec, 1);
  const steps = goal > 0 ? [0.25, 0.5, 1] : [0.25, 0.5, 0.75];
  return r < steps[0] ? 1 : r < steps[1] ? 2 : r < steps[2] ? 3 : 4;
}

function workByHour(from, days) {
  // minutes of focus in each hour of the last `days` days: grid[day][hour]
  const grid = Array.from({ length: days }, () => new Array(24).fill(0));
  const add = (a, b) => {
    for (let t0 = a; t0 < b;) {
      const d = new Date(t0);
      const hourEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1).getTime();
      const seg = Math.min(b, hourEnd) - t0;
      const di = Math.round((startOfDay(t0) - from) / 86400000);
      if (di >= 0 && di < days) grid[di][d.getHours()] += seg / 60000;
      t0 += seg;
    }
  };
  sessions.forEach(s => { if (s.end > from) add(s.start, s.start + s.dur * 1000); });
  const live = liveWorkSec();
  if (live) add(Date.now() - live * 1000, Date.now());
  return grid;
}

function renderHeat() {
  const el = $('#heat');
  const weeks = settings.heatRange;
  const today0 = startOfDay();
  const dow = (new Date(today0).getDay() + 6) % 7; // Monday = 0
  const start = addDays(today0, -(weeks - 1) * 7 - dow);
  const byDay = workByDay();
  const maxSec = Math.max(0, ...byDay.values());

  // cell size: fill the width, but never tinier than 10px
  const avail = Math.max(200, el.clientWidth || $('#view-stats').clientWidth - 56);
  const gap = weeks > 30 ? 3 : 4;
  const cell = Math.max(weeks > 30 ? 9 : 7, Math.min(24, Math.floor((avail - 30) / weeks) - gap));

  let cells = '';
  let months = '';
  let prevMonth = -1;
  let activeDays = 0;
  for (let w = 0; w < weeks; w++) {
    const colStart = addDays(start, w * 7);
    const m = new Date(colStart).getMonth();
    if (m !== prevMonth) {
      if (w < weeks - 1 || prevMonth === -1) months += `<span style="grid-column:${w + 1}">${t('monthsShort')[m]}</span>`;
      prevMonth = m;
    }
    for (let r = 0; r < 7; r++) {
      const ts = addDays(colStart, r);
      if (ts > today0) { cells += '<i class="hc future"></i>'; continue; }
      const sec = byDay.get(dayKey(ts)) || 0;
      if (sec >= 60) activeDays++;
      const lv = dayLevel(sec, maxSec);
      const tip = `${dayTitle(ts)} · ${sec >= 60 ? fmtDur(sec) : t('noWork')}`;
      cells += `<i class="hc l${lv}${ts === today0 ? ' today' : ''}" data-tip="${esc(tip)}" style="--d:${w * 7 + r}"></i>`;
    }
  }

  // current streak of days with work (today may still be empty)
  let streak = 0;
  for (let ts = (byDay.get(dayKey(today0)) || 0) >= 60 ? today0 : addDays(today0, -1); (byDay.get(dayKey(ts)) || 0) >= 60; ts = addDays(ts, -1)) streak++;

  const dayNames = t('daysMon');
  const legend = [0, 1, 2, 3, 4].map(l => `<i class="hc l${l}"></i>`).join('');

  // hour-of-day grid for the last 7 days
  const from7 = addDays(today0, -6);
  const hours = workByHour(from7, 7);
  let hcells = '';
  for (let d = 0; d < 7; d++) {
    const ts = addDays(from7, d);
    hcells += `<span class="hh-day">${esc(t('days')[new Date(ts).getDay()])}</span>`;
    for (let h = 0; h < 24; h++) {
      const min = Math.round(hours[d][h]);
      const lv = min < 1 ? 0 : min < 15 ? 1 : min < 30 ? 2 : min < 45 ? 3 : 4;
      const tip = `${dayTitle(ts)}, ${pad(h)}:00–${pad((h + 1) % 24)}:00 · ${min ? `${min} ${t('min')}` : t('noWork')}`;
      hcells += `<i class="hc l${lv}" data-tip="${esc(tip)}" style="--d:${d * 24 + h}"></i>`;
    }
  }
  const hourLabels = [0, 6, 12, 18].map(h => `<span style="grid-column:${h + 2} / span 4">${pad(h)}:00</span>`).join('');

  el.style.setProperty('--cell', `${cell}px`);
  el.style.setProperty('--gap', `${gap}px`);
  el.innerHTML = `
    <div class="heat-scroll">
      <div class="heat-grid-wrap">
        <div class="heat-months" style="grid-template-columns:repeat(${weeks}, var(--cell))">${months}</div>
        <div class="heat-body">
          <div class="heat-days"><span>${dayNames[0]}</span><span></span><span>${dayNames[2]}</span><span></span><span>${dayNames[4]}</span><span></span><span></span></div>
          <div class="heat-grid">${cells}</div>
        </div>
      </div>
    </div>
    <div class="heat-foot">
      <span class="muted">${t('activeDays')(activeDays)}${streak > 1 ? ` · ${t('streak')(streak)}` : ''}</span>
      <span class="heat-legend">${t('less')}${legend}${t('more')}</span>
    </div>
    <h3 class="heat-sub">${t('byHour')}</h3>
    <div class="hours hours-head">${hourLabels}</div>
    <div class="hours">${hcells}</div>`;
  const sc = el.querySelector('.heat-scroll');
  sc.scrollLeft = sc.scrollWidth;
}

// one floating tooltip for all squares
function initHeatTip() {
  const tip = document.createElement('div');
  tip.className = 'heat-tip';
  document.body.appendChild(tip);
  $('#heat').addEventListener('mouseover', e => {
    const c = e.target.closest('[data-tip]');
    if (!c) { tip.classList.remove('show'); return; }
    tip.textContent = c.dataset.tip;
    const r = c.getBoundingClientRect();
    const z = settings.zoom || 1;
    tip.classList.add('show');
    const w = tip.offsetWidth;
    const x = Math.min(Math.max(8, (r.left + r.width / 2) / z - w / 2), window.innerWidth / z - w - 8);
    tip.style.left = `${x}px`;
    tip.style.top = `${r.top / z - tip.offsetHeight - 8}px`;
  });
  $('#heat').addEventListener('mouseleave', () => tip.classList.remove('show'));
}

function renderBars(today0, goalSec, live) {
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
}

function renderHistory() {
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
}

function render() {
  renderTimer();
  renderSteppers();
  renderControls();
  if (view === 'stats') renderStats();
}

/* ================= Projects ================= */
const projKey = s => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
const cleanName = s => String(s || '').trim().replace(/\s+/g, ' ');
let showHidden = false;

function projectList() {
  const map = new Map();
  const get = name => {
    const k = projKey(name);
    if (!map.has(k)) map.set(k, { key: k, name: cleanName(name), total: 0, week: 0, today: 0, count: 0, last: 0, deadline: '', hidden: false, created: 0, current: false });
    return map.get(k);
  };
  for (const m of Object.values(projects)) {
    const p = get(m.name);
    p.name = m.name; p.deadline = m.deadline || ''; p.hidden = !!m.hidden; p.created = m.created || 0;
  }
  const today0 = startOfDay();
  const week0 = today0 - 6 * 86400000;
  const add = (p, start, dur) => {
    p.total += dur;
    if (start >= week0) p.week += dur;
    if (start >= today0) p.today += dur;
  };
  [...sessions].sort((a, b) => a.start - b.start).forEach(s => {
    if (!projKey(s.label)) return;
    const p = get(s.label);
    if (!projects[p.key]) p.name = cleanName(s.label); // latest spelling wins
    add(p, s.start, s.dur);
    p.count += 1;
    p.last = Math.max(p.last, s.end || s.start);
  });
  const cur = projKey($('#label').value);
  if (cur) {
    const p = map.get(cur);
    if (p) {
      p.current = true;
      const live = liveWorkSec();
      if (live) { add(p, Date.now(), live); p.last = Date.now(); }
    }
  }
  return [...map.values()].sort((a, b) => (b.current - a.current) || (Math.max(b.last, b.created) - Math.max(a.last, a.created)));
}

function parseDay(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : 0;
}
function fmtDate(s) {
  const d = new Date(parseDay(s));
  const thisYear = d.getFullYear() === new Date().getFullYear();
  const y = thisYear ? '' : ` ${d.getFullYear()}`;
  return settings.lang === 'ru'
    ? `${d.getDate()} ${t('months')[d.getMonth()]}${y}`
    : `${t('months')[d.getMonth()]} ${d.getDate()}${y}`;
}
function deadlineInfo(s) {
  const ts = parseDay(s);
  if (!ts) return null;
  const days = Math.round((ts - startOfDay()) / 86400000);
  const when = days < 0 ? t('dlOver')(-days) : days === 0 ? t('dlToday') : days === 1 ? t('dlTomorrow') : t('dlLeft')(days);
  const cls = days < 0 ? 'over' : days <= 2 ? 'soon' : '';
  return { days, when, cls, text: `${fmtDate(s)} · ${when}` };
}

function meta(key, name) {
  if (!projects[key]) projects[key] = { name: cleanName(name), deadline: '', hidden: false, created: Date.now() };
  return projects[key];
}

function updateDatalist() {
  const names = projectList().filter(p => !p.hidden).map(p => p.name);
  $('#projectList').innerHTML = names.map(n => `<option value="${esc(n)}"></option>`).join('');
}

function renderLabelMeta() {
  const el = $('#labelMeta');
  const key = projKey($('#label').value);
  const p = key && projectList().find(x => x.key === key);
  if (!p || (!p.total && !p.deadline)) { el.innerHTML = ''; return; }
  const parts = [];
  if (p.total >= 60) parts.push(`${t('pTotal')}: ${fmtDur(p.total)}`);
  const dl = deadlineInfo(p.deadline);
  if (dl) parts.push(`<span class="dl-text ${dl.cls}">${t('deadline')}: ${esc(dl.text)}</span>`);
  el.innerHTML = parts.join(' · ');
}

const ICONS = {
  play: '<svg viewBox="0 0 20 20"><path d="M6.5 4.8v10.4L15 10z" fill="currentColor"/></svg>',
  edit: '<svg viewBox="0 0 20 20"><path d="M12.8 4.2l3 3L8 15H5v-3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  hide: '<svg viewBox="0 0 20 20"><path d="M3 10s2.6-5 7-5 7 5 7 5-2.6 5-7 5-7-5-7-5z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 16L16 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  show: '<svg viewBox="0 0 20 20"><path d="M3 10s2.6-5 7-5 7 5 7 5-2.6 5-7 5-7-5-7-5z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>',
  cal: '<svg viewBox="0 0 20 20"><rect x="3.5" y="4.5" width="13" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5h13M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

function projRow(p) {
  const dl = deadlineInfo(p.deadline);
  const chip = dl
    ? `<span class="chip ${dl.cls}"><button class="chip-main" data-act="deadline">${ICONS.cal}<span>${esc(dl.text)}</span></button><button class="chip-x" data-act="cleardl" title="${esc(t('clearDeadline'))}">${ICONS.x}</button></span>`
    : (p.hidden ? '' : `<button class="chip add" data-act="deadline">${esc(t('addDeadline'))}</button>`);
  const sub = [`${t('pToday')} ${fmtDur(p.today)}`, `${t('pWeek')} ${fmtDur(p.week)}`, t('pSessions')(p.count)].join(' · ');
  const acts = p.hidden
    ? `<button class="icon-btn sm" data-act="unhide" title="${esc(t('unhide'))}">${ICONS.show}</button>`
    : `<button class="icon-btn sm" data-act="work" title="${esc(t('workOn'))}">${ICONS.play}</button>
       <button class="icon-btn sm" data-act="rename" title="${esc(t('rename'))}">${ICONS.edit}</button>
       <button class="icon-btn sm" data-act="hide" title="${esc(t('hide'))}">${ICONS.hide}</button>`;
  return `<div class="proj${p.hidden ? ' hidden' : ''}${p.current ? ' current' : ''}" data-key="${esc(p.key)}">
    <div class="proj-top">
      <div class="proj-name"><span class="pn">${esc(p.name)}</span>${p.current ? `<span class="tag mini">${esc(t('current'))}</span>` : ''}</div>
      <div class="proj-total">${fmtDur(p.total)}</div>
    </div>
    <div class="proj-bottom">
      <div class="proj-sub">${sub}</div>
      <div class="proj-acts">${acts}</div>
      ${chip}
      <input type="date" class="dl-input" value="${esc(p.deadline)}" tabindex="-1">
    </div>
  </div>`;
}

function renderProjects() {
  const all = projectList();
  const vis = all.filter(p => !p.hidden);
  const hid = all.filter(p => p.hidden);
  $('#projList').innerHTML = vis.length ? vis.map(projRow).join('') : `<div class="empty-state">${t('projEmpty')}</div>`;
  const btn = $('#btnHidden');
  btn.style.display = hid.length ? '' : 'none';
  btn.textContent = showHidden ? t('hideHidden') : t('hiddenN')(hid.length);
  $('#projHidden').hidden = !showHidden || !hid.length;
  $('#projHidden').innerHTML = hid.map(projRow).join('');
  updateDatalist();
}

function renameProject(key, name) {
  name = cleanName(name);
  const nk = projKey(name);
  if (!nk) return;
  sessions.forEach(s => { if (projKey(s.label) === key) s.label = name; });
  const old = projects[key];
  if (old) {
    delete projects[key];
    const target = projects[nk];
    projects[nk] = { ...old, ...(target || {}), name, deadline: (target && target.deadline) || old.deadline };
  } else if (projects[nk]) {
    projects[nk].name = name;
  }
  if (projKey($('#label').value) === key) $('#label').value = name;
  persistNow();
}

function startRename(row) {
  const key = row.dataset.key;
  const span = row.querySelector('.pn');
  const input = document.createElement('input');
  input.className = 'text-input inline';
  input.value = span.textContent;
  input.maxLength = 120;
  span.replaceWith(input);
  input.focus();
  input.select();
  let done = false;
  const finish = ok => {
    if (done) return;
    done = true;
    if (ok && cleanName(input.value) && cleanName(input.value) !== span.textContent) renameProject(key, input.value);
    renderProjects();
    renderLabelMeta();
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finish(true);
    else if (e.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

function onProjectClick(e) {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const row = btn.closest('.proj');
  const key = row.dataset.key;
  const name = row.querySelector('.pn') ? row.querySelector('.pn').textContent : key;
  switch (btn.dataset.act) {
    case 'work':
      $('#label').value = name;
      persist();
      $$('.tab')[0].click();
      break;
    case 'rename':
      startRename(row);
      return;
    case 'hide':
      meta(key, name).hidden = true;
      break;
    case 'unhide':
      meta(key, name).hidden = false;
      break;
    case 'deadline': {
      const input = row.querySelector('.dl-input');
      try { input.showPicker(); } catch { input.focus(); input.click(); }
      return;
    }
    case 'cleardl':
      meta(key, name).deadline = '';
      break;
  }
  persist();
  renderProjects();
  renderLabelMeta();
}

function onDeadlineChange(e) {
  if (!e.target.classList.contains('dl-input')) return;
  const row = e.target.closest('.proj');
  meta(row.dataset.key, row.querySelector('.pn').textContent).deadline = e.target.value || '';
  persist();
  renderProjects();
  renderLabelMeta();
}

/* ================= Apps (time in programs) ================= */
let appStats = [];
let appCands = [];

function fmtLong(sec) {
  const h = sec / 3600;
  if (h >= 10) {
    const s = (Math.round(h * 10) / 10).toString();
    return `${settings.lang === 'ru' ? s.replace('.', ',') : s} ${t('h')}`;
  }
  return fmtDur(sec);
}
function avatar(name, exe) {
  let hsh = 0;
  for (const c of exe) hsh = (hsh * 31 + c.charCodeAt(0)) >>> 0;
  const letter = (name.trim()[0] || '?').toUpperCase();
  return `<div class="app-ico" style="--h:${hsh % 360}">${esc(letter)}</div>`;
}

async function loadApps() {
  appStats = (await api.appsStats()) || [];
  renderApps();
}

function renderApps() {
  const list = [...appStats].sort((a, b) => b.total.run - a.total.run);
  $('#appList').innerHTML = list.length ? list.map(a => `<div class="app" data-exe="${esc(a.exe)}">
      ${avatar(a.name, a.exe)}
      <div class="app-main">
        <div class="app-name"><span>${esc(a.name)}</span>${a.running ? `<span class="dot" title="${esc(t('running'))}"></span>` : ''}</div>
        <div class="app-sub">${t('aToday')} ${fmtDur(a.today.run)} · ${t('aWeek')} ${fmtLong(a.week.run)}</div>
      </div>
      <div class="app-total"><div>${fmtLong(a.total.run)}</div><div class="app-total-sub">${t('aActive')} ${fmtLong(a.total.active)}</div></div>
      <button class="del" data-exe="${esc(a.exe)}" title="${esc(t('stopTrack'))}">${ICONS.x}</button>
    </div>`).join('') : `<div class="empty-state">${t('appsNone')}</div>`;
}

let appInstalled = [];
let pickItems = [];

function renderCandidates() {
  const q = $('#appSearch').value.trim().toLowerCase();
  const tracked = new Set(appStats.map(a => a.exe));
  const match = c => !q || c.name.toLowerCase().includes(q) || c.exe.includes(q);
  const running = appCands.filter(c => !tracked.has(c.exe) && match(c));
  const runSet = new Set(running.map(c => c.exe));
  const rest = appInstalled.filter(c => !tracked.has(c.exe) && !runSet.has(c.exe) && match(c));
  pickItems = [];
  const block = (title, list) => {
    if (!list.length) return '';
    const rows = list.map(c => {
      pickItems.push(c);
      return `<button class="cand" data-i="${pickItems.length - 1}">${avatar(c.name, c.exe)}<span class="cand-text"><span class="cand-name">${esc(c.name)}</span><span class="cand-exe">${esc(c.exe)}</span></span><span class="cand-add">+</span></button>`;
    }).join('');
    return `<div class="cand-group">${esc(title)}</div>${rows}`;
  };
  const html = block(t('appsPick'), running) + block(q ? t('appsFound') : t('appsAll'), rest);
  $('#appCandidates').innerHTML = html || `<div class="empty-state">${q ? t('appsNothing') : t('appsNoCand')}</div>`;
}

async function openPicker() {
  $('#appPicker').hidden = false;
  $('#btnAddApp').style.display = 'none';
  $('#appSearch').value = '';
  $('#appCandidates').innerHTML = '<div class="cand-loading"></div>';
  setTimeout(() => $('#appSearch').focus(), 60);
  const [run, all] = await Promise.all([api.appsCandidates(), api.appsInstalled()]);
  appCands = run || [];
  appInstalled = all || [];
  renderCandidates();
}

async function addApp(c) {
  if (!c) return;
  appStats = (await api.appsTrack(c)) || appStats;
  renderApps();
  renderCandidates();
  toast(t('appsAdded')(c.name));
}
function closePicker() {
  $('#appPicker').hidden = true;
  $('#btnAddApp').style.display = '';
}

/* ================= Launch with Windows ================= */
let autostartOn = false;
function renderAutostart() { $('#autostartToggle').classList.toggle('on', autostartOn); }

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
  if (key === 'lang') { applyI18n(); renderLabelMeta(); renderApps(); if (view === 'projects') renderProjects(); }
  if (key === 'theme') applyTheme();
  if (key === 'alwaysOnTop') api.alwaysOnTop(val);
  persist();
  render();
}

let animT = null;
function animateView() {
  const v = $(`#view-${view}`);
  $$('.view.anim').forEach(x => x.classList.remove('anim'));
  v.classList.add('anim');
  clearTimeout(animT);
  animT = setTimeout(() => v.classList.remove('anim'), 1100);
}

function applyZoom() {
  document.documentElement.style.zoom = String(settings.zoom);
}
function setZoom(z) {
  z = Math.round(Math.min(ZOOM.max, Math.max(ZOOM.min, z)) * 10) / 10;
  if (z === settings.zoom) return;
  settings.zoom = z;
  applyZoom();
  toast(`${t('scale')} ${Math.round(z * 100)}%`);
  persist();
  if (view === 'stats') renderStats();
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
    animateView();
    if (view === 'stats') { historyLimit = 7; renderStats(); }
    if (view === 'projects') renderProjects();
    if (view === 'apps') { closePicker(); loadApps(); }
    $('main').scrollTop = 0;
  }));

  $('#btnStart').addEventListener('click', toggle);
  $('#btnReset').addEventListener('click', reset);
  $('#btnSkip').addEventListener('click', skip);
  $('#label').addEventListener('input', () => { persist(); renderLabelMeta(); });

  // Projects
  $('#projAdd').addEventListener('submit', e => {
    e.preventDefault();
    const name = cleanName($('#projName').value);
    if (!name) return;
    meta(projKey(name), name).hidden = false;
    $('#projName').value = '';
    persist();
    renderProjects();
  });
  $('#projList').addEventListener('click', onProjectClick);
  $('#projHidden').addEventListener('click', onProjectClick);
  $('#projList').addEventListener('change', onDeadlineChange);
  $('#projHidden').addEventListener('change', onDeadlineChange);
  $('#btnHidden').addEventListener('click', () => { showHidden = !showHidden; renderProjects(); });

  // Apps
  $('#btnAddApp').addEventListener('click', openPicker);
  $('#btnPickClose').addEventListener('click', closePicker);
  $('#appCandidates').addEventListener('click', e => {
    const b = e.target.closest('.cand');
    if (b) addApp(pickItems[Number(b.dataset.i)]);
  });
  $('#appSearch').addEventListener('input', renderCandidates);
  $('#appSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter' && pickItems.length === 1) addApp(pickItems[0]);
    if (e.key === 'Escape') closePicker();
  });
  $('#btnBrowse').addEventListener('click', async () => addApp(await api.appsBrowse(t('appsBrowseTitle'))));
  $('#appList').addEventListener('click', async e => {
    const b = e.target.closest('.del');
    if (!b) return;
    appStats = (await api.appsUntrack(b.dataset.exe)) || appStats;
    renderApps();
  });
  setInterval(() => { if (view === 'apps') loadApps(); }, 10000);

  // Launch with Windows
  $('#autostartToggle').addEventListener('click', async () => {
    const want = !autostartOn;
    if (await api.setAutostart(want)) autostartOn = want;
    renderAutostart();
  });
  $('#label').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });

  $$('.toggle[data-key]').forEach(el => el.addEventListener('click', () => setValue(el.dataset.key, !settings[el.dataset.key])));
  $$('.seg[data-key] button').forEach(b => b.addEventListener('click', () => setValue(b.closest('.seg').dataset.key, b.dataset.val)));
  $$('#chartRange button').forEach(b => b.addEventListener('click', () => { chartRange = Number(b.dataset.range); renderControls(); renderStats(); }));
  $$('#heatRange button').forEach(b => b.addEventListener('click', () => { settings.heatRange = Number(b.dataset.range); persist(); animateView(); renderControls(); renderStats(); }));
  $$('#chartMode button').forEach(b => b.addEventListener('click', () => { settings.chartMode = b.dataset.mode; persist(); animateView(); renderControls(); renderStats(); }));
  initHeatTip();
  let resizeT = null;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (view === 'stats') renderStats(); }, 120); });

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

  // Interface scale: Ctrl + / Ctrl − / Ctrl 0 and Ctrl + wheel
  document.addEventListener('keydown', e => {
    if (!e.ctrlKey || e.altKey) return;
    if (e.code === 'Equal' || e.code === 'NumpadAdd') { e.preventDefault(); setZoom(settings.zoom + ZOOM.step); }
    else if (e.code === 'Minus' || e.code === 'NumpadSubtract') { e.preventDefault(); setZoom(settings.zoom - ZOOM.step); }
    else if (e.code === 'Digit0' || e.code === 'Numpad0') { e.preventDefault(); setZoom(1); }
  });
  window.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setZoom(settings.zoom + (e.deltaY < 0 ? ZOOM.step : -ZOOM.step));
  }, { passive: false });

  api.onPhaseDue(() => tick());

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.code === 'KeyR') reset();
    else if (e.code === 'KeyS') skip();
    else if (/^Digit[1-5]$/.test(e.code)) $$('.tab')[Number(e.code.slice(5)) - 1].click();
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
    else api.saveSync(snapshot());
  };
  // Log an in-progress work session if the app is closed mid-session
  window.addEventListener('beforeunload', () => {
    if (timer.phase === 'work' && timer.startedAt) logWork(false, true);
    else api.saveSync(snapshot());
  });

  // Refresh stats around midnight / while visible
  setInterval(() => {
    if (view === 'stats') renderStats();
    if (view === 'projects' && !document.querySelector('.proj .inline')) renderProjects();
    renderLabelMeta();
  }, 15000);
}

/* ================= Boot ================= */
(async function boot() {
  const data = (await api.load()) || {};
  settings = { ...DEFAULTS, ...(data.settings || {}) };
  sessions = Array.isArray(data.sessions) ? data.sessions : [];
  projects = data.projects && typeof data.projects === 'object' ? data.projects : {};
  systemDark = await api.systemDark();
  autostartOn = !!(await api.autostart());
  if (data.current && data.current.label) $('#label').value = data.current.label;

  applyTheme();
  applyZoom();
  applyI18n();
  setPhase('work');
  bind();
  render();
  renderAutostart();
  updateDatalist();
  renderLabelMeta();
  setInterval(tick, 250);
})();
