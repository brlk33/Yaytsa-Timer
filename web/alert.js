'use strict';
const $ = id => document.getElementById(id);

let d = {};
let shownAt = 0;
let nagTimer = null;
let sinceTimer = null;
let ctx = null;
const isBreak = () => d.next === 'break';

function since() {
  const s = Math.floor((Date.now() - shownAt) / 1000);
  if (s < 60) { $('since').textContent = ''; return; }
  const m = Math.floor(s / 60);
  $('since').textContent = d.lang === 'en' ? `${m} min ago` : `${m} мин назад`;
}

function chime() {
  if (!d.sound) return;
  try {
    ctx = ctx || new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notes = isBreak() ? [880, 659.25, 523.25] : [659.25, 880, 1318.5];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      const t0 = now + i * 0.18;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.2, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 1.2);
    });
  } catch {}
}

function nudge() {
  const c = $('card');
  c.classList.remove('nudge');
  void c.offsetWidth;
  c.classList.add('nudge');
}

window.showAlert = (data) => {
  d = data || {};
  document.documentElement.dataset.theme = d.theme || 'dark';
  $('title').textContent = d.title || '';
  $('body').textContent = d.body || '';
  $('go').textContent = d.goLabel || 'OK';
  $('ok').textContent = d.okLabel || '×';
  $('dot').classList.toggle('break', isBreak());
  $('go').classList.toggle('break', isBreak());
  $('go').style.display = d.hideGo ? 'none' : '';
  $('since').textContent = '';
  const card = $('card');
  card.hidden = false;
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  shownAt = Date.now();
  clearInterval(nagTimer);
  clearInterval(sinceTimer);
  chime();
  // Nag: repeat the sound and shake until the user reacts
  const every = Math.max(5, Number(d.repeatSec) || 15) * 1000;
  nagTimer = setInterval(() => { chime(); nudge(); }, every);
  sinceTimer = setInterval(since, 5000);
};

window.hideAlert = () => {
  clearInterval(nagTimer);
  clearInterval(sinceTimer);
  $('card').hidden = true;
};

$('go').addEventListener('click', () => window.alertApi.act('start'));
$('ok').addEventListener('click', () => window.alertApi.act('dismiss'));
window.alertApi.ready();
