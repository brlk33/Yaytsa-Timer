'use strict';

/* ================= i18n ================= */
const I18N = {
  ru: {
    appName: 'Яйцетаймер', updReady: v => `Версия ${v} загружена`, updNow: 'Перезапустить',
    tabTimer: 'Таймер', tabStats: 'Статистика', tabSettings: 'Настройки',
    work: 'Работа', break: 'Перерыв', today: 'Сегодня',
    start: 'Старт', pause: 'Пауза', resume: 'Продолжить',
    reset: 'Сбросить', skip: 'Пропустить этап',
    labelPh: 'Над чем работаете?',
    session: n => `Сессия ${n}`, paused: 'пауза',
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
    dataName: 'Учёт времени', dataDesc: 'Экспорт и импорт истории в CSV или папка с данными',
    openFolder: 'Открыть папку',
    nBreakTitle: 'Время перерыва', nBreakBody: m => `Рабочий заход завершён. Отдохните ${m} мин.`,
    nWorkTitle: 'За работу', nWorkBody: m => `Перерыв окончен. Следующий заход — ${m} мин.`,
    test: 'Тест 5 сек', testIn: n => `Тест… ${n}`, testToast: 'Через 5 секунд появится напоминание',
    testTitle: 'Тест напоминания', closeToTray: 'Сворачивать в трей', closeToTrayDesc: 'Крестик прячет окно в трей, таймер продолжает идти',
    trayOpen: 'Открыть Яйцетаймер', trayQuit: 'Выйти', trayTest: 'Тест напоминания (5 сек)',
    popup: 'Окно поверх всего', popupDesc: 'Справа снизу, поверх игр и видео. Не исчезает, пока не нажмёте',
    popupA: 'Уведомление с кнопками', popupDescA: 'Всплывает поверх экрана с кнопкой «Начать перерыв». Выключено — простое уведомление',
    dataDescA: 'Экспорт и импорт истории в CSV',
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
    alertSound: 'Звук сигнала', choose: 'Выбрать', soundDefault: 'Стандартный', soundSystem: 'Звуки телефона', soundFile: 'Свой файл',
    soundSet: n => `Звук: ${n}`, updTitle: v => `Доступна версия ${v}`, updText: 'Обновление уже скачано, установка займёт несколько секунд.', updInstall: 'Обновить', updLater: 'Позже',
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
winMin: 'Свернуть', winMax: 'Развернуть', winClose: 'Закрыть', importCsv: 'Импорт CSV', imported: n => `Добавлено ${n} ${plural(n, 'заход', 'захода', 'заходов')}`, importNone: 'В файле нет новых заходов',    importBad: 'Не удалось прочитать файл', delete: 'Удалить', cancel: 'Отмена', delProjTitle: n => `Удалить проект «${n}»?`,    delProjText: 'Время заходов останется в статистике, но без названия проекта. Это нельзя отменить.', projDeleted: 'Проект удалён',    pTodayL: 'Сегодня', pWeekL: 'За 7 дней', calClear: 'Убрать', calToday: 'Сегодня', noProjects: 'Проектов пока нет',
    monthsNom: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
scale: 'Масштаб', appsPickTitle: 'Добавить программу', appsSearchPh: 'Поиск по программам на компьютере', appsBrowse: 'Выбрать .exe вручную…', appsBrowseTitle: 'Выберите программу',    appsFound: 'Найдено', appsAll: 'Все программы', appsNothing: 'Ничего не нашлось. Попробуйте выбрать .exe вручную', appsAdded: n => `«${n}» отслеживается`,    r3m: '3 мес', r6m: '6 мес', r1y: 'Год', modeBars: 'Столбики', modeSquares: 'Квадратики',    monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],    daysMon: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], noWork: 'без работы',    activeDays: n => `${n} ${plural(n, 'рабочий день', 'рабочих дня', 'рабочих дней')}`, streak: n => `серия ${n} ${plural(n, 'день', 'дня', 'дней')} подряд`,    less: 'Меньше', more: 'Больше', byHour: 'По часам за неделю',
  },
  en: {
    appName: 'Яйцетаймер', updReady: v => `Version ${v} downloaded`, updNow: 'Restart',
    tabTimer: 'Timer', tabStats: 'Stats', tabSettings: 'Settings',
    work: 'Focus', break: 'Break', today: 'Today',
    start: 'Start', pause: 'Pause', resume: 'Resume',
    reset: 'Reset', skip: 'Skip phase',
    labelPh: 'What are you working on?',
    session: n => `Session ${n}`, paused: 'paused',
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
    dataName: 'Time log', dataDesc: 'Export and import history as CSV, or open the data folder',
    openFolder: 'Open folder',
    nBreakTitle: 'Break time', nBreakBody: m => `Focus session done. Rest for ${m} min.`,
    nWorkTitle: 'Back to work', nWorkBody: m => `Break is over. Next session — ${m} min.`,
    test: 'Test 5 sec', testIn: n => `Test… ${n}`, testToast: 'The reminder will pop up in 5 seconds',
    testTitle: 'Reminder test', closeToTray: 'Close to tray', closeToTrayDesc: 'The close button hides the window to the tray; the timer keeps running',
    trayOpen: 'Open Яйцетаймер', trayQuit: 'Quit', trayTest: 'Test reminder (5 sec)',
    popup: 'Pop-up over everything', popupDesc: 'Bottom-right, over games and videos. Stays until you click it',
    popupA: 'Notification with buttons', popupDescA: 'Pops up over the screen with a “Start break” button. Off: a plain notification',
    dataDescA: 'Export and import history as CSV',
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
    alertSound: 'Alert sound', choose: 'Choose', soundDefault: 'Default', soundSystem: 'Phone sounds', soundFile: 'Your own file',
    soundSet: n => `Sound: ${n}`, updTitle: v => `Version ${v} is available`, updText: 'The update is already downloaded, installing takes a few seconds.', updInstall: 'Update', updLater: 'Later',
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
winMin: 'Minimize', winMax: 'Maximize', winClose: 'Close', importCsv: 'Import CSV', imported: n => `Added ${n} session${n === 1 ? '' : 's'}`, importNone: 'No new sessions in the file',    importBad: 'Could not read the file', delete: 'Delete', cancel: 'Cancel', delProjTitle: n => `Delete project “${n}”?`,    delProjText: 'Session time stays in your stats, just without the project name. This can’t be undone.', projDeleted: 'Project deleted',    pTodayL: 'Today', pWeekL: 'Last 7 days', calClear: 'Clear', calToday: 'Today', noProjects: 'No projects yet',
    monthsNom: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
const ANDROID = !!api.android;
const DEFAULTS = {
  work: 25, brk: 5, autoStart: false, sound: true, notify: true,
  lang: 'ru', theme: 'dark', goal: 4, alwaysOnTop: false, popup: true, closeToTray: true,
  zoom: 1, chartMode: 'bars', heatRange: 13,
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
const snapshot = () => ({ settings, sessions, projects, current: { label: $('#label').value }, sync: syncSnapshot() });
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    api.save(snapshot());
    syncSchedule();
  }, 250);
}
function persistNow() {
  clearTimeout(saveTimer);
  syncSchedule();
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
    end: timer.running ? Math.min(Date.now(), timer.endAt) : Date.now(),
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
function alertTexts(finished, test) {
  const next = finished === 'work' ? 'break' : 'work';
  const auto = test ? false : settings.autoStart;
  return {
    next, auto,
    title: test ? t('testTitle') : (next === 'break' ? t('nBreakTitle') : t('nWorkTitle')),
    body: auto
      ? (next === 'break' ? t('aBreakAuto')(settings.brk) : t('aWorkAuto')(settings.work))
      : (next === 'break' ? t('aBreakBody')(settings.work, settings.brk) : t('aWorkBody')(settings.work)),
    goLabel: next === 'break' ? t('goBreak') : t('goWork'),
    okLabel: auto ? t('gotIt') : t('later'),
  };
}
function alertPhaseEnd(finished, test) {
  alertIsTest = !!test;
  const { next, auto, title, body, goLabel, okLabel } = alertTexts(finished, test);
  if (settings.popup || test) {
    api.showAlert({
      next, title, body, goLabel, okLabel,
      hideGo: auto,
      test: !!test,
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

// Light on resources: while the window is hidden in the tray only the title, tray tooltip and
// taskbar progress update, once a second; a paused timer redraws once a second too.
let winVisible = true;
let lastTick = 0;
function tick() {
  if (timer.running && Date.now() >= timer.endAt) {
    timer.remaining = 0;
    complete();
    return;
  }
  const now = Date.now();
  if (winVisible && timer.running) renderTimer();
  else if (now - lastTick >= 1000) {
    lastTick = now;
    if (winVisible) renderTimer(); else renderOuter();
  }
}

/* ================= Rendering ================= */
let lastTitle = '';
let lastProg = '';
let lastStatus = '';
const TIMER_KEYS = ['phase', 'total', 'remaining', 'running', 'endAt', 'startedAt'];
let lastHostState = '';
function syncHost() {
  if (!api.timerState) return;
  const a = alertTexts(timer.phase);
  const state = {
    phase: timer.phase, total: timer.total, running: timer.running,
    remaining: timer.running ? 0 : timer.remaining, endAt: timer.running ? timer.endAt : 0,
    startedAt: timer.startedAt,
    label: $('#label').value.trim(),
    sound: settings.sound, popup: settings.popup,
    text: {
      phase: timer.phase === 'work' ? t('work') : t('break'), paused: t('paused'),
      pause: t('pause'), resume: t('resume'), reset: t('reset'),
      doneTitle: a.title, doneBody: a.body, go: a.auto ? '' : a.goLabel, ok: a.okLabel,
    },
  };
  const key = JSON.stringify(state);
  if (key !== lastHostState) { lastHostState = key; api.timerState(state); }
}
function applyHostTimer(s) {
  if (!s || (s.phase !== 'work' && s.phase !== 'break') || !(s.total > 0)) return false;
  TIMER_KEYS.forEach(k => { if (k in s) timer[k] = s[k]; });
  timer.running = !!timer.running;
  if (!timer.running && !(timer.remaining >= 0)) timer.remaining = timer.total;
  return true;
}

function renderOuter() {
  syncHost();
  syncTimer();
  const rem = currentRemaining();
  const isWork = timer.phase === 'work';
  const touched = !isUntouched();
  const ratio = timer.total ? 1 - rem / timer.total : 0;
  const title = touched ? `${fmtClock(rem)} · ${isWork ? t('work') : t('break')} — ${t('appName')}` : t('appName');
  if (title !== lastTitle) { api.title(title); lastTitle = title; }
  const prog = touched ? Math.min(1, Math.max(0.001, ratio)).toFixed(3) : '-1';
  const progKey = `${prog}|${touched && !timer.running}`;
  if (progKey !== lastProg) { lastProg = progKey; api.progress(Number(prog), touched && !timer.running); }
  syncTray();
}

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
  const ring = $('#ringFill');
  ring.style.strokeDashoffset = String(289.03 * (1 - ratio));
  ring.classList.toggle('break', !isWork);
  ring.classList.toggle('empty', ratio <= 0);

  const btn = $('#btnStart');
  const btnText = timer.running ? t('pause') : (touched ? t('resume') : t('start'));
  if (ANDROID) {
    if (!btn.dataset.ico) { btn.dataset.ico = '1'; btn.innerHTML = PLAY_PAUSE_SVG; }
    btn.classList.toggle('is-running', timer.running); // the triangle flows into two bars (CSS)
    btn.setAttribute('aria-label', btnText);
  } else btn.textContent = btnText;
  btn.classList.toggle('secondary', timer.running);

  const goalH = settings.goal;
  const tSec = todaySec();
  $('#todayVal').textContent = goalH > 0 ? `${fmtDur(tSec)} / ${fmtHours(goalH)}` : fmtDur(tSec);
  if (ANDROID) $('#faceToday').textContent = $('#todayVal').textContent;

  // Running time in the title bar while another tab is open
  const status = touched && view !== 'timer' ? `${isWork ? 'w' : 'b'}${timer.running ? '' : 'p'}|${fmtClock(rem)}` : '';
  if (status !== lastStatus) {
    lastStatus = status;
    const el = $('#tbStatus');
    el.hidden = !status;
    if (status) {
      el.textContent = fmtClock(rem);
      el.className = `brand-status${isWork ? '' : ' break'}${timer.running ? '' : ' paused'}`;
    }
  }
  renderOuter();
}

function renderSteppers() {
  if (ANDROID) renderDials();
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

function renderHeat() {
  const el = $('#heat');
  const weeks = settings.heatRange;
  const today0 = startOfDay();
  const dow = (new Date(today0).getDay() + 6) % 7; // Monday = 0
  const start = addDays(today0, -(weeks - 1) * 7 - dow);
  const byDay = workByDay();
  const maxSec = Math.max(0, ...byDay.values());

  // Columns are 1fr and cells are square, so any range always fits the width (no scrolling).
  let cells = '';
  let months = '';
  let prevMonth = -1;
  let activeDays = 0;
  const dayNames = t('daysMon');
  [0, 2, 4].forEach(r => { cells += `<span class="hd" style="grid-row:${r + 1}">${dayNames[r]}</span>`; });
  for (let w = 0; w < weeks; w++) {
    const colStart = addDays(start, w * 7);
    const m = new Date(colStart).getMonth();
    if (m !== prevMonth) {
      // skip a month label squeezed into the last two columns
      if (prevMonth === -1 || w < weeks - (weeks > 30 ? 2 : 0)) months += `<span style="grid-column:${w + 2}">${t('monthsShort')[m]}</span>`;
      prevMonth = m;
    }
    for (let r = 0; r < 7; r++) {
      const ts = addDays(colStart, r);
      const pos = `grid-column:${w + 2};grid-row:${r + 1}`;
      if (ts > today0) { cells += `<i class="hc future" style="${pos}"></i>`; continue; }
      const sec = byDay.get(dayKey(ts)) || 0;
      if (sec >= 60) activeDays++;
      const lv = dayLevel(sec, maxSec);
      const tip = `${dayTitle(ts)} · ${sec >= 60 ? fmtDur(sec) : t('noWork')}`;
      cells += `<i class="hc l${lv}${ts === today0 ? ' today' : ''}" data-tip="${esc(tip)}" style="${pos};--d:${w * 7 + r}"></i>`;
    }
  }

  // current streak of days with work (today may still be empty)
  let streak = 0;
  for (let ts = (byDay.get(dayKey(today0)) || 0) >= 60 ? today0 : addDays(today0, -1); (byDay.get(dayKey(ts)) || 0) >= 60; ts = addDays(ts, -1)) streak++;

  const legend = [0, 1, 2, 3, 4].map(l => `<i class="hc l${l}"></i>`).join('');
  el.style.setProperty('--weeks', weeks);
  el.classList.toggle('dense', weeks > 30);
  el.innerHTML = `
    <div class="heat-months">${months}</div>
    <div class="heat-grid">${cells}</div>
    <div class="heat-foot">
      <span class="muted">${t('activeDays')(activeDays)}${streak > 1 ? ` · ${t('streak')(streak)}` : ''}</span>
      <span class="heat-legend">${t('less')}${legend}${t('more')}</span>
    </div>`;
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
    tip.classList.add('show');
    const w = tip.offsetWidth;
    tip.style.left = `${Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)}px`;
    tip.style.top = `${r.top - tip.offsetHeight - 8}px`;
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

// The custom suggestion list reads projects on demand; nothing to precompute.
function updateDatalist() {}

function renderLabelMeta() {
  const el = $('#labelMeta');
  const key = projKey($('#label').value);
  const p = key && projectList().find(x => x.key === key);
  if (!p || (!p.total && !p.deadline)) { el.innerHTML = ''; fitTimer(); return; }
  const parts = [];
  if (p.total >= 60) parts.push(`${t('pTotal')}: ${fmtDur(p.total)}`);
  const dl = deadlineInfo(p.deadline);
  if (dl) parts.push(`<span class="dl-text ${dl.cls}">${t('deadline')}: ${esc(dl.text)}</span>`);
  el.innerHTML = parts.join(' · ');
  fitTimer();
}

const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 5.2v13.6a.8.8 0 0 0 1.2.7l10.4-6.8a.8.8 0 0 0 0-1.4L8.2 4.5A.8.8 0 0 0 7 5.2z" fill="currentColor"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M15.5 4.5l4 4L9 19H5v-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  hide: '<svg viewBox="0 0 24 24"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 19.5l15-15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  show: '<svg viewBox="0 0 24 24"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4.5 7h15M10 4h4M6.5 7l.9 12a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cal: '<svg viewBox="0 0 20 20"><rect x="3.5" y="4.5" width="13" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5h13M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  prev: '<svg viewBox="0 0 20 20"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 20 20"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function projRow(p) {
  const dl = deadlineInfo(p.deadline);
  const chip = dl
    ? `<span class="chip ${dl.cls}"><button class="chip-main" data-act="deadline">${ICONS.cal}<span>${esc(dl.text)}</span></button><button class="chip-x" data-act="cleardl" title="${esc(t('clearDeadline'))}">${ICONS.x}</button></span>`
    : (p.hidden ? '' : `<button class="chip add" data-act="deadline">${ICONS.cal}<span>${esc(t('addDeadline').replace('+ ', ''))}</span></button>`);
  const stat = (label, val) => `<span class="ps"><span class="ps-l">${esc(label)}</span> ${val}</span>`;
  const stats = [stat(t('pTodayL'), fmtDur(p.today)), `<span class="ps">${t('pSessions')(p.count)}</span>`].join('');
  const btn = (act, icon, title, cls = '') => `<button class="icon-btn sm${cls}" data-act="${act}" title="${esc(title)}">${icon}</button>`;
  const acts = p.hidden
    ? btn('unhide', ICONS.show, t('unhide')) + btn('delete', ICONS.trash, t('delete'), ' danger')
    : btn('work', ICONS.play, t('workOn')) + btn('rename', ICONS.edit, t('rename')) + btn('hide', ICONS.hide, t('hide')) + btn('delete', ICONS.trash, t('delete'), ' danger');
  return `<div class="proj${p.hidden ? ' hidden' : ''}${p.current ? ' current' : ''}" data-key="${esc(p.key)}">
    <div class="proj-top">
      <div class="proj-name"><span class="pn">${esc(p.name)}</span>${p.current ? `<span class="tag mini">${esc(t('current'))}</span>` : ''}</div>
      <div class="proj-acts">${acts}</div>
      <div class="proj-total" title="${esc(t('pTotal'))}">${fmtDur(p.total)}</div>
    </div>
    <div class="proj-stats">${stats}${chip}</div>
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

// Deleting keeps the time (stats stay right) but drops the project name from its sessions.
function deleteProject(key) {
  sessions.forEach(s => { if (projKey(s.label) === key) s.label = ''; });
  delete projects[key];
  if (projKey($('#label').value) === key) $('#label').value = '';
  persistNow();
  toast(t('projDeleted'));
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

async function onProjectClick(e) {
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
    case 'delete':
      if (!(await confirmModal(t('delProjTitle')(name), t('delProjText'), t('delete')))) return;
      deleteProject(key);
      break;
    case 'deadline':
      openCalendar(btn, (projects[key] && projects[key].deadline) || '', v => {
        meta(key, name).deadline = v;
        persist();
        renderProjects();
        renderLabelMeta();
      });
      return;
    case 'cleardl':
      meta(key, name).deadline = '';
      break;
  }
  persist();
  renderProjects();
  renderLabelMeta();
}

function onDeadlineChange() {}

/* ---------- Calendar popover (deadline picker) ---------- */
let calState = null; // {month: Date(1st of month), value: 'YYYY-MM-DD', onPick, anchor}

function isoDay(ts) { return dayKey(ts); }

function renderCalendar() {
  const { month, value } = calState;
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const today = isoDay(Date.now());
  const title = settings.lang === 'ru'
    ? `${t('monthsNom')[m]} ${y}`
    : `${t('monthsNom')[m]} ${y}`;
  let days = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m, 1 - lead + i);
    const iso = isoDay(d.getTime());
    const cls = ['cd'];
    if (d.getMonth() !== m) cls.push('out');
    if (iso === today) cls.push('today');
    if (iso === value) cls.push('sel');
    if (d.getDay() === 0 || d.getDay() === 6) cls.push('we');
    days += `<button class="${cls.join(' ')}" data-d="${iso}">${d.getDate()}</button>`;
  }
  $('#cal').innerHTML = `
    <div class="cal-head">
      <span class="cal-title">${esc(title)}</span>
      <button class="icon-btn sm" data-nav="-1">${ICONS.prev}</button>
      <button class="icon-btn sm" data-nav="1">${ICONS.next}</button>
    </div>
    <div class="cal-wd">${t('daysMon').map(n => `<span>${esc(n)}</span>`).join('')}</div>
    <div class="cal-grid">${days}</div>
    <div class="cal-foot">
      <button class="ghost" data-act="clear">${esc(t('calClear'))}</button>
      <button class="ghost" data-act="today">${esc(t('calToday'))}</button>
    </div>`;
}

function openCalendar(anchor, value, onPick) {
  const base = value ? new Date(parseDay(value)) : new Date();
  calState = { month: new Date(base.getFullYear(), base.getMonth(), 1), value, onPick, anchor };
  renderCalendar();
  const cal = $('#cal');
  cal.hidden = false;
  const r = anchor.getBoundingClientRect();
  const w = cal.offsetWidth, h = cal.offsetHeight;
  let x = Math.min(Math.max(10, r.right - w), window.innerWidth - w - 10);
  let y = r.bottom + 8;
  if (y + h > window.innerHeight - 10) y = Math.max(10, r.top - h - 8);
  cal.style.left = `${x}px`;
  cal.style.top = `${y}px`;
}

function closeCalendar() {
  $('#cal').hidden = true;
  calState = null;
}

function bindCalendar() {
  $('#cal').addEventListener('click', e => {
    if (!calState) return;
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      calState.month = new Date(calState.month.getFullYear(), calState.month.getMonth() + Number(nav.dataset.nav), 1);
      renderCalendar();
      return;
    }
    const day = e.target.closest('[data-d]');
    const act = e.target.closest('[data-act]');
    let v = null;
    if (day) v = day.dataset.d;
    else if (act && act.dataset.act === 'today') v = isoDay(Date.now());
    else if (act && act.dataset.act === 'clear') v = '';
    if (v === null) return;
    const pick = calState.onPick;
    closeCalendar();
    pick(v);
  });
  document.addEventListener('mousedown', e => {
    if (calState && !e.target.closest('#cal') && !e.target.closest('[data-act="deadline"]')) closeCalendar();
  });
  window.addEventListener('resize', () => { if (calState) closeCalendar(); });
  $('main').addEventListener('scroll', () => { if (calState) closeCalendar(); }, { passive: true });
}

/* ---------- Project suggestions under the task field ---------- */
let sugIndex = -1;
let sugItems = [];

function renderSuggest() {
  const box = $('#labelSuggest');
  const q = cleanName($('#label').value).toLowerCase();
  sugItems = projectList().filter(p => !p.hidden && p.key !== q && (!q || p.name.toLowerCase().includes(q))).slice(0, 6);
  if (!sugItems.length || document.activeElement !== $('#label')) { box.hidden = true; return; }
  if (sugIndex >= sugItems.length) sugIndex = sugItems.length - 1;
  box.innerHTML = sugItems.map((p, i) => {
    const dl = deadlineInfo(p.deadline);
    return `<button class="sug${i === sugIndex ? ' on' : ''}" data-i="${i}" tabindex="-1">
      <span class="sug-name">${esc(p.name)}</span>
      <span class="sug-meta">${dl ? `<span class="dl-text ${dl.cls}">${esc(dl.when)}</span> · ` : ''}${fmtDur(p.total)}</span>
    </button>`;
  }).join('');
  box.hidden = false;
}

function pickSuggest(i) {
  const p = sugItems[i];
  if (!p) return;
  $('#label').value = p.name;
  $('#labelSuggest').hidden = true;
  persist();
  renderLabelMeta();
  $('#label').blur();
}

function bindLabelSuggest() {
  const input = $('#label');
  input.addEventListener('focus', () => { sugIndex = -1; renderSuggest(); });
  input.addEventListener('input', () => { sugIndex = -1; renderSuggest(); });
  input.addEventListener('blur', () => setTimeout(() => { $('#labelSuggest').hidden = true; }, 120));
  input.addEventListener('keydown', e => {
    const box = $('#labelSuggest');
    if (box.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sugIndex = (sugIndex + 1) % sugItems.length; renderSuggest(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sugIndex = (sugIndex - 1 + sugItems.length) % sugItems.length; renderSuggest(); }
    else if (e.key === 'Enter' && sugIndex >= 0) { e.preventDefault(); pickSuggest(sugIndex); }
    else if (e.key === 'Escape') box.hidden = true;
  });
  $('#labelSuggest').addEventListener('mousedown', e => {
    const b = e.target.closest('.sug');
    if (b) { e.preventDefault(); pickSuggest(Number(b.dataset.i)); }
  });
}

/* ---------- Confirm dialog ---------- */
let modalResolve = null;
function confirmModal(title, text, okLabel, opts = {}) {
  $('#modalTitle').textContent = title;
  $('#modalText').textContent = text;
  $('#modalOk').textContent = okLabel;
  $('#modalOk').classList.toggle('safe', !!opts.safe);
  $('#modalCancel').textContent = opts.cancel || t('cancel');
  $('#modal').hidden = false;
  setTimeout(() => $('#modalCancel').focus(), 30);
  return new Promise(res => { modalResolve = res; });
}
function closeModal(ok) {
  $('#modal').hidden = true;
  if (modalResolve) { const r = modalResolve; modalResolve = null; r(ok); }
}

/* ---------- Phone: action sheet, alert sound, swipes between tabs ---------- */
let sheetResolve = null;
function actionSheet(title, items) {
  $('#sheetTitle').textContent = title;
  $('#sheetItems').innerHTML = items.map(i =>
    `<button class="sheet-item${i.on ? ' on' : ''}" data-key="${esc(i.key)}">${i.icon || ''}<span>${esc(i.label)}</span></button>`).join('');
  $('#sheet').hidden = false;
  return new Promise(res => { sheetResolve = res; });
}
function closeSheet(key) {
  $('#sheet').hidden = true;
  if (sheetResolve) { const r = sheetResolve; sheetResolve = null; r(key); }
}

const SHEET_ICONS = {
  bell: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  file: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.5V6.2l10-2.2v11.3"/><circle cx="6.6" cy="17.5" r="2.4"/><circle cx="16.6" cy="15.3" r="2.4"/></svg>',
};
async function pickSound() {
  const k = await actionSheet(t('alertSound'), [
    { key: 'default', label: t('soundDefault'), icon: SHEET_ICONS.bell },
    { key: 'system', label: t('soundSystem'), icon: SHEET_ICONS.phone },
    { key: 'file', label: t('soundFile'), icon: SHEET_ICONS.file },
  ]);
  if (!k) return;
  const r = await api.pickSound(k);
  if (!r) return;
  const name = r.name || t('soundDefault');
  $('#soundName').textContent = name;
  toast(t('soundSet')(name));
}

// Phone: the tabs are pages side by side in <main>; the strip follows the finger and settles
// on a page with one transform, so nothing is hidden, redrawn or re-animated on the way.
function pagerTabs() { return $$('.tab').filter(b => b.offsetParent !== null); }
function pagerIndex() { return Math.max(0, pagerTabs().findIndex(b => b.dataset.view === view)); }
function setPager(animate, offset = 0) {
  const main = $('main');
  main.style.transition = animate ? 'transform .4s cubic-bezier(.22, .9, .3, 1)' : 'none';
  main.style.transform = `translate3d(calc(${-pagerIndex() * 100}% + ${offset}px), 0, 0)`;
  drawBlob(pagerIndex() - offset / (main.clientWidth || innerWidth));
}

/* Bouncy tab highlight. The two edges are springs chasing the tab under the finger: the edge
   in front is stiff and overshoots a little, the one behind is soft and catches up late, so
   the drop stretches, squashes and wobbles into place. */
const blob = { l: 0, r: 0, vl: 0, vr: 0, tl: 0, tr: 0, raf: 0, last: 0, ready: false, w0: 80 };
function blobRects() {
  const list = pagerTabs();
  const bar = $('.tabs').getBoundingClientRect();
  return list.map(b => { const r = b.getBoundingClientRect(); return [r.left - bar.left + 4, r.right - bar.left - 4]; });
}
function drawBlob(f) {
  const el = $('.tab-blob');
  if (!el) return;
  const rects = blobRects(), n = rects.length;
  if (!n) return;
  const fc = Math.max(0, Math.min(n - 1, f));
  const a = Math.min(n - 1, Math.floor(fc)), b = Math.min(n - 1, a + 1), t = fc - a;
  blob.w0 = rects[0][1] - rects[0][0];
  const over = (f - fc) * blob.w0 * 0.3; // pulled past the ends: lean that way
  blob.tl = rects[a][0] + (rects[b][0] - rects[a][0]) * t + over;
  blob.tr = rects[a][1] + (rects[b][1] - rects[a][1]) * t + over;
  if (!blob.ready) { blob.ready = true; blob.l = blob.tl; blob.r = blob.tr; }
  if (!blob.raf) { blob.last = performance.now(); blob.raf = requestAnimationFrame(blobStep); }
}
function animateBlob(to) { drawBlob(to); }
function blobStep(now) {
  const dt = Math.min(0.032, (now - blob.last) / 1000);
  blob.last = now;
  const right = (blob.tl + blob.tr) > (blob.l + blob.r); // moving right: the right edge leads
  const spring = (x, v, target, lead) => {
    const k = lead ? 520 : 210, c = lead ? 24 : 19;
    const acc = k * (target - x) - c * v;
    v += acc * dt;
    return [x + v * dt, v];
  };
  [blob.l, blob.vl] = spring(blob.l, blob.vl, blob.tl, !right);
  [blob.r, blob.vr] = spring(blob.r, blob.vr, blob.tr, right);
  if (blob.r - blob.l < 30) blob.r = blob.l + 30;
  const width = blob.r - blob.l;
  const stretch = width / blob.w0;
  const squash = Math.max(-0.06, Math.min(0.18, (stretch - 1) * 0.16));
  const el = $('.tab-blob');
  el.style.transform = `translate3d(${blob.l.toFixed(2)}px, 0, 0) scale(1, ${(1 - squash).toFixed(3)})`;
  el.style.width = `${width.toFixed(2)}px`;
  // Icons and labels light up as the drop reaches them
  const rects = blobRects(), mid = (blob.l + blob.r) / 2;
  pagerTabs().forEach((tab, k) => {
    const c = (rects[k][0] + rects[k][1]) / 2, w = rects[k][1] - rects[k][0] + 8;
    tab.style.setProperty('--lit', (0.42 + 0.58 * Math.max(0, 1 - Math.abs(mid - c) / w)).toFixed(3));
  });
  const done = Math.abs(blob.tl - blob.l) < 0.3 && Math.abs(blob.tr - blob.r) < 0.3 && Math.abs(blob.vl) < 4 && Math.abs(blob.vr) < 4;
  blob.raf = done ? 0 : requestAnimationFrame(blobStep);
}

function bindSwipe() {
  const main = $('main');
  const el = document.createElement('div');
  el.className = 'tab-blob';
  $('.tabs').prepend(el);
  // Only things that move with the finger themselves keep the gesture
  const noSwipe = '.popover, .suggest, .inline, .modal, .sheet-wrap';
  let x0 = 0, y0 = 0, lastX = 0, lastT = 0, vx = 0, dx = 0, lock = '';
  main.addEventListener('touchstart', e => {
    lock = e.touches.length !== 1 || e.target.closest(noSwipe) ? 'no' : '';
    x0 = lastX = e.touches[0].clientX; y0 = e.touches[0].clientY;
    lastT = performance.now(); vx = 0; dx = 0;
  }, { passive: true });
  main.addEventListener('touchmove', e => {
    if (lock === 'no' || lock === 'y') return;
    const x = e.touches[0].clientX, mx = x - x0, my = e.touches[0].clientY - y0;
    if (!lock) {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (lock === 'y') return;
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    }
    if (e.cancelable) e.preventDefault();
    const now = performance.now();
    vx = (x - lastX) / Math.max(1, now - lastT) * 0.6 + vx * 0.4; // px per ms, smoothed
    lastX = x; lastT = now;
    const i = pagerIndex(), n = pagerTabs().length;
    dx = mx;
    if ((dx > 0 && i === 0) || (dx < 0 && i === n - 1)) dx = mx / 3; // rubber band at the ends
    setPager(false, dx);
  }, { passive: false });
  const end = () => {
    if (lock !== 'x') { lock = ''; return; }
    lock = '';
    const list = pagerTabs(), i = pagerIndex();
    const w = main.clientWidth || innerWidth;
    let target = i;
    if (dx < -w * 0.2 || vx < -0.35) target = i + 1;
    else if (dx > w * 0.2 || vx > 0.35) target = i - 1;
    target = Math.min(list.length - 1, Math.max(0, target));
    if (target !== i) list[target].click(); // the tab handler moves the strip
    else setPager(true);
  };
  main.addEventListener('touchend', end);
  main.addEventListener('touchcancel', end);
  addEventListener('resize', () => { blob.ready = false; setPager(false); });
}

/* Phase lengths: a small wheel. Pull it down to go up (bigger numbers sit above), like
   scrolling a list; it snaps to a step with a little bounce. */
const WHEEL_ROW = 34;
// The window works like a lens: a number grows and brightens as it rolls into the middle.
// Five numbers per wheel, so this is a handful of style writes per frame.
function wheelPlace(d, dy) {
  d._dy = dy;
  const col = d.querySelector('.wheel-col');
  col.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
  col.querySelectorAll('.wr').forEach((r, i) => {
    const dist = Math.abs((i - 2) * WHEEL_ROW + dy) / WHEEL_ROW; // 0 = in the middle of the lens
    const k = Math.max(0, 1 - dist);
    const lens = k * k * (3 - 2 * k); // smooth bulge
    r.style.transform = `scale(${(0.56 + 0.44 * lens).toFixed(3)})`;
    r.style.opacity = (0.28 + 0.72 * lens).toFixed(3);
  });
}
// Let go: the drum springs back to the step with a small bounce.
function wheelSettle(d) {
  cancelAnimationFrame(d._raf);
  let x = d._dy || 0, v = d._v || 0, last = performance.now();
  const step = now => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    v += (-340 * x - 15 * v) * dt;
    x += v * dt;
    if (Math.abs(x) < 0.15 && Math.abs(v) < 3) { wheelPlace(d, 0); d._raf = 0; return; }
    wheelPlace(d, x);
    d._raf = requestAnimationFrame(step);
  };
  d._raf = requestAnimationFrame(step);
}
function bindDials() {
  $$('.dial').forEach(d => {
    const key = d.dataset.key;
    let x0 = 0, y0 = 0, base = 0, id = null, lock = '', lastY = 0, lastT = 0;
    d.addEventListener('pointerdown', e => {
      id = e.pointerId; x0 = e.clientX; y0 = lastY = e.clientY; lastT = performance.now(); base = 0; lock = '';
      cancelAnimationFrame(d._raf);
      base = -(d._dy || 0);
    });
    d.addEventListener('pointermove', e => {
      if (e.pointerId !== id) return;
      const mx = e.clientX - x0, my = e.clientY - y0;
      if (!lock) {
        if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
        lock = Math.abs(my) > Math.abs(mx) ? 'y' : 'x';
        if (lock === 'y') { try { d.setPointerCapture(id); } catch {} d.classList.add('drag'); }
      }
      if (lock !== 'y') return; // sideways: that is a page swipe
      const now = performance.now();
      d._v = (e.clientY - lastY) / Math.max(1, now - lastT) * 1000;
      lastY = e.clientY; lastT = now;
      let dy = my - base;
      const lim = LIMITS[key];
      while (Math.abs(dy) > WHEEL_ROW / 2) {
        const dir = dy > 0 ? 1 : -1; // finger down = bigger
        if ((dir > 0 && settings[key] >= lim.max) || (dir < 0 && settings[key] <= lim.min)) break;
        changeSetting(key, dir);
        base += dir * WHEEL_ROW;
        dy -= dir * WHEEL_ROW;
      }
      const atEnd = (dy > 0 && settings[key] >= lim.max) || (dy < 0 && settings[key] <= lim.min);
      wheelPlace(d, atEnd ? dy / 3 : dy);
    });
    const up = e => {
      if (e.pointerId !== id) return;
      id = null; lock = '';
      d.classList.remove('drag');
      d._v = Math.max(-900, Math.min(900, d._v || 0)) * 0.25;
      wheelSettle(d);
    };
    d.addEventListener('pointerup', up);
    d.addEventListener('pointercancel', up);
  });
}
function renderDials() {
  $$('.dial').forEach(d => {
    const key = d.dataset.key, lim = LIMITS[key], v = settings[key];
    const col = d.querySelector('.wheel-col');
    if (col.dataset.v !== String(v)) {
      col.dataset.v = v;
      col.innerHTML = [2, 1, 0, -1, -2].map(k => {
        const x = v + k * lim.step;
        return `<span class="wr">${x >= lim.min && x <= lim.max ? x : ''}</span>`;
      }).join('');
      wheelPlace(d, d._dy || 0);
    }
    d.querySelector('.dial-unit').textContent = t('min');
  });
}

// Play and pause drawn as two halves with the same points, so CSS can morph one into the other.
const PLAY_PAUSE_SVG = '<svg class="pp" viewBox="0 0 24 24"><path class="pp-a"/><path class="pp-b"/></svg>';

// Little reactions to presses (phone): restart a CSS animation on the pressed thing.
function kick(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/* ---------- CSV import (our own export format, RU ";" or EN ",") ---------- */
function parseCsvLine(line, sep) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
// Same start minute and same task = the same session (lengths may differ by CSV rounding).
const sessionKey = s => `${Math.round(s.start / 60000)}|${projKey(s.label)}`;

// Our own CSV export (RU ";" or EN ","): Date, Start, End, Minutes, Task.
function sessionsFromCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return null;
  const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
  const out = [];
  for (const line of lines) {
    const [date, from, to, mins, task] = parseCsvLine(line, sep);
    const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec((date || '').trim());
    const fm = /^(\d{1,2}):(\d{2})$/.exec((from || '').trim());
    const tm = /^(\d{1,2}):(\d{2})$/.exec((to || '').trim());
    const minutes = parseFloat(String(mins || '').replace(',', '.'));
    if (!dm || !fm || !(minutes > 0)) continue; // header or junk
    const start = new Date(+dm[1], +dm[2] - 1, +dm[3], +fm[1], +fm[2]).getTime();
    const dur = Math.round(minutes * 60);
    let end = start + dur * 1000;
    if (tm) {
      let e2 = new Date(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]).getTime();
      if (e2 < start) e2 += 86400000; // crossed midnight
      end = e2;
    }
    out.push({ start, end, dur, label: cleanName(task || '') });
  }
  return out;
}

// CSV import; duplicates (same start minute and task) are skipped, so re-importing never doubles.
async function importFile(file) {
  let text;
  try { text = (await file.text()).replace(/^﻿/, ''); } catch { toast(t('importBad')); return; }
  const found = sessionsFromCsv(text);
  if (!found) { toast(t('importBad')); return; }
  const seen = new Set(sessions.map(sessionKey));
  let added = 0;
  for (const s of found) {
    const k = sessionKey(s);
    if (seen.has(k)) continue;
    seen.add(k);
    sessions.push({ id: newId(), ...s, full: s.dur >= settings.work * 60 });
    added++;
  }
  if (!added) { toast(t('importNone')); return; }
  sessions.sort((a, b) => a.start - b.start);
  await persistNow();
  render();
  renderLabelMeta();
  if (view === 'stats') renderStats();
  if (view === 'projects') renderProjects();
  toast(t('imported')(added));
}

/* ---------- Responsive timer view ----------
   When the window is too short, parts disappear in a fixed order (least important first).
   Each step is decided from the full layout, so shrinking never brings a hidden part back;
   only growing the window can. Works at any zoom: WebView2 zoom changes CSS px itself. */
const FIT_STEPS = ['test', 'meta', 'today', 't-md', 'brk', 'work', 'label', 't-sm', 'phase'];
let fitLevel = -1;

function fitTimer() {
  if (ANDROID) return;
  const v = $('#view-timer');
  if (!v.classList.contains('active')) return;
  const main = $('main');
  let level = 0;
  const apply = n => {
    FIT_STEPS.forEach((s, i) => v.classList.toggle(`fit-${s}`, i < n));
  };
  apply(0);
  while (level < FIT_STEPS.length && v.offsetHeight > main.clientHeight + 1) {
    level++;
    apply(level);
  }
  if (level !== fitLevel) fitLevel = level;
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
// The program's own icon when Windows gives one, otherwise a coloured letter.
function avatar(name, exe, icon) {
  if (icon && icon.startsWith('data:image/png;base64,')) return `<div class="app-ico has-img"><img src="${icon}" alt="" draggable="false"></div>`;
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
      ${avatar(a.name, a.exe, a.icon)}
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
      return `<button class="cand" data-i="${pickItems.length - 1}">${avatar(c.name, c.exe, c.icon)}<span class="cand-text"><span class="cand-name">${esc(c.name)}</span><span class="cand-exe">${esc(c.exe)}</span></span><span class="cand-add">+</span></button>`;
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
  if (ANDROID) return;
  const v = $(`#view-${view}`);
  $$('.view.anim').forEach(x => x.classList.remove('anim'));
  v.classList.add('anim');
  clearTimeout(animT);
  animT = setTimeout(() => v.classList.remove('anim'), 1100);
}

// Zoom is done by WebView2 itself, so CSS px, media queries and the responsive layout follow it.
function applyZoom() {
  api.zoom(settings.zoom);
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
    if (view === 'timer') fitTimer();
    if (ANDROID) setPager(true);
    closeCalendar();
    renderTimer();
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
  api.onWindowVisible(v => { winVisible = v; if (v) { render(); fitTimer(); } });

  // Title bar: drag, double-click to maximize, top edge resizes, own window buttons
  $('#titlebar').addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('.win-btn')) return;
    const edge = e.target.closest('[data-hit]');
    api.ncdrag(edge ? Number(edge.dataset.hit) : 2);
  });
  $('#titlebar').addEventListener('dblclick', e => { if (!e.target.closest('.win-btn')) api.winMax(); });
  $('#winMin').addEventListener('click', () => api.winMin());
  $('#winMax').addEventListener('click', () => api.winMax());
  $('#winClose').addEventListener('click', () => api.winClose());
  api.onMaximized(m => document.documentElement.classList.toggle('maxed', !!m));

  bindLabelSuggest();
  bindCalendar();
  $('#modalCancel').addEventListener('click', () => closeModal(false));
  $('#modalOk').addEventListener('click', () => closeModal(true));
  $('#modal').addEventListener('mousedown', e => { if (e.target.id === 'modal') closeModal(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#modal').hidden) closeModal(false);
    else if (!$('#cal').hidden) closeCalendar();
  });

  // CSV import
  const pickCsv = () => { $('#csvFile').value = ''; $('#csvFile').click(); };
  $('#btnImport').addEventListener('click', pickCsv);
  $('#btnImport2').addEventListener('click', pickCsv);
  $('#csvFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) importFile(f); });

  // Responsive timer view
  let fitT = null;
  window.addEventListener('resize', () => { cancelAnimationFrame(fitT); fitT = requestAnimationFrame(fitTimer); });

  api.onAlertAction(action => {
    if (alertIsTest) { alertIsTest = false; return; }
    if (action !== 'start') return;
    tick(); // a phase that ran out while the app slept is completed first
    if (!timer.running) start();
  });
  let updAsked = false;
  api.onUpdateReady(v => {
    const el = $('#update');
    el.querySelector('span').textContent = t('updReady')(v);
    el.querySelector('button').textContent = t('updNow');
    el.hidden = false;
    // On the phone ask right away, once per launch
    if (ANDROID && !updAsked && $('#modal').hidden) {
      updAsked = true;
      confirmModal(t('updTitle')(v), t('updText'), t('updInstall'), { safe: true, cancel: t('updLater') })
        .then(ok => { if (ok) api.installUpdate(); });
    }
  });
  $('#update button').addEventListener('click', () => api.installUpdate());
  api.onTrayAction(a => {
    if (a === 'toggle') toggle();
    else if (a === 'test') runTest();
  });
  $('#btnTest').addEventListener('click', runTest);
  $('#btnTest2').addEventListener('click', runTest);
  window.addEventListener('error', e => api.log(String(e.message)));

  if (ANDROID) {
    api.onTimerState(s => { if (applyHostTimer(s)) { lastHostState = ''; render(); } });
    // System back: close what is open, then go back to the timer; false lets the app go to background
    window.__back = () => {
      if (!$('#sheet').hidden) { closeSheet(null); return true; }
      if (!$('#modal').hidden) { closeModal(false); return true; }
      if (!$('#cal').hidden) { closeCalendar(); return true; }
      if (view !== 'timer') { $('.tab[data-view="timer"]').click(); return true; }
      return false;
    };
  }
  if (ANDROID) {
    bindSwipe();
    bindDials();
    $('#btnReset').addEventListener('click', () => kick($('#btnReset'), 'spin'));
    $('#btnSkip').addEventListener('click', () => kick($('#btnSkip'), 'nudge'));
    $('#btnStart').addEventListener('click', () => kick($('#btnStart'), 'press'));
    $$('.seg[data-key="theme"] button').forEach(b => b.addEventListener('click', () => kick(b, 'swing')));
    $$('.tab').forEach(b => b.addEventListener('click', () => kick(b, 'pop')));
    $$('.toggle').forEach(b => b.addEventListener('click', () => kick(b, 'press')));
    $('#btnSound').addEventListener('click', pickSound);
    $('#sheetCancel').addEventListener('click', () => closeSheet(null));
    $('#sheet').addEventListener('click', e => {
      if (e.target.id === 'sheet') closeSheet(null);
      const it = e.target.closest('.sheet-item');
      if (it) closeSheet(it.dataset.key);
    });
    api.soundInfo().then(r => { $('#soundName').textContent = (r && r.name) || t('soundDefault'); });
  }
  api.onSystemTheme(dark => { systemDark = dark; if (settings.theme === 'system') applyTheme(); });

  // Called by the host right before quitting
  window.__beforeQuit = () => {
    if (timer.phase === 'work' && timer.startedAt) logWork(false, true);
    else api.saveSync(snapshot());
  };
  // Log an in-progress work session if the app is closed mid-session
  window.addEventListener('beforeunload', () => {
    if (ANDROID) { api.saveSync(snapshot()); return; }
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
  if (ANDROID) {
    Object.values(I18N).forEach(l => { l.popup = l.popupA; l.popupDesc = l.popupDescA; l.dataDesc = l.dataDescA; l.workLen = l.work; l.breakLen = l.break; });
    I18N.ru.trayTest = 'Проверка сигнала'; I18N.en.trayTest = 'Test the alert'; // shorter labels on the phone
  }
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
  if (ANDROID) applyHostTimer(data.timer);
  if (ANDROID && settings.theme === 'system') settings.theme = systemDark ? 'dark' : 'light'; // the phone offers light and dark only
  bind();
  syncInit(data);
  render();
  renderAutostart();
  updateDatalist();
  renderLabelMeta();
  setInterval(tick, 250);
  if (ANDROID) { renderProjects(); renderStats(); setPager(false); } // neighbour pages are visible while swiping
  setTimeout(() => { const sp = $('#splash'); if (sp) sp.remove(); }, 1600); // the launch animation is pure CSS
  if (api.ready) { tick(); api.ready(); }
})();
