'use strict';
const p = new URLSearchParams(location.search);
const d = JSON.parse(p.get('d') || '{}');
const $ = id => document.getElementById(id);

document.documentElement.dataset.theme = d.theme || 'dark';
$('title').textContent = d.title || '';
$('body').textContent = d.body || '';
$('go').textContent = d.goLabel || 'OK';
$('ok').textContent = d.okLabel || '×';
const isBreak = d.next === 'break';
$('dot').classList.toggle('break', isBreak);
$('go').classList.toggle('break', isBreak);
if (d.hideGo) $('go').style.display = 'none';

const shownAt = Date.now();
function since() {
  const s = Math.floor((Date.now() - shownAt) / 1000);
  if (s < 60) { $('since').textContent = ''; return; }
  const m = Math.floor(s / 60);
  $('since').textContent = d.lang === 'en' ? `${m} min ago` : `${m} мин назад`;
}
setInterval(since, 5000);

let ctx = null;
function chime() {
  if (!d.sound) return;
  try {
    ctx = ctx || new AudioContext();
    const now = ctx.currentTime;
    const notes = isBreak ? [880, 659.25, 523.25] : [659.25, 880, 1318.5];
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

// Nag: repeat sound and shake until the user reacts
chime();
const every = Math.max(5, Number(d.repeatSec) || 15) * 1000;
setInterval(() => {
  chime();
  const c = $('card');
  c.classList.remove('nudge');
  void c.offsetWidth;
  c.classList.add('nudge');
}, every);

$('go').addEventListener('click', () => window.alertApi.act('start'));
$('ok').addEventListener('click', () => window.alertApi.act('dismiss'));
