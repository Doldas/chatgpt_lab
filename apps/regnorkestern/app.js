'use strict';
const canvas = document.querySelector('#pond');
const ctx = canvas.getContext('2d');
const rain = document.querySelector('#rain');
const sound = document.querySelector('#sound');
const tempo = document.querySelector('#tempo');
const status = document.querySelector('#status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let rings = [], frame = null, timer = null, count = 0, audio = null, audible = false;
let width = 1, height = 1;
const voices = new Set();
function draw(now) {
  ctx.clearRect(0, 0, width, height);
  rings = rings.filter(r => now - r.time < 2400);
  for (const r of rings) {
    const age = (now - r.time) / 2400;
    ctx.strokeStyle = `hsla(${r.hue},65%,75%,${(1-age)*0.7})`;
    ctx.lineWidth = 1.4;
    for (let n = 0; n < 3; n++) {
      ctx.beginPath();
      ctx.ellipse(r.x*width, r.y*height, 5 + (reduced.matches ? 22 : age*95) + n*8, 3 + (reduced.matches ? 11 : age*47) + n*4, 0, 0, Math.PI*2);
      ctx.stroke();
    }
  }
}
function animate(now) {
  frame = null;
  draw(now);
  if (rings.length && !document.hidden) frame = requestAnimationFrame(animate);
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width; height = rect.height;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width*scale); canvas.height = Math.round(height*scale);
  ctx.setTransform(scale,0,0,scale,0,0);
  draw(performance.now());
}
function silence() {
  for (const voice of voices) { voice.gain.gain.value = 0; voice.osc.stop(); }
  voices.clear();
}
function tone(x,y) {
  if (!audible || !audio || audio.state !== 'running' || voices.size >= 12) return;
  const notes = [0,2,4,7,9];
  const midi = 48 + notes[Math.min(4,Math.floor(x*5))] + (y < .5 ? 12 : 0);
  const osc = audio.createOscillator(), gain = audio.createGain();
  const t = audio.currentTime;
  osc.type = 'sine'; osc.frequency.value = 440 * 2**((midi-69)/12);
  gain.gain.setValueAtTime(0,t);
  gain.gain.linearRampToValueAtTime(.025,t+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,t+1.1);
  osc.connect(gain); gain.connect(audio.destination);
  const voice = {osc,gain}; voices.add(voice);
  osc.onended = () => { voices.delete(voice); osc.disconnect(); gain.disconnect(); };
  osc.start(t); osc.stop(t+1.2);
}
function drop(x,y) {
  if (document.hidden) return;
  rings.push({x,y,hue:155+x*55,time:performance.now()});
  if (rings.length > 48) rings.shift();
  tone(x,y);
  if (frame === null) frame = requestAnimationFrame(animate);
}
function stop(message) {
  clearTimeout(timer); timer = null;
  rain.textContent = 'Starta regn'; rain.setAttribute('aria-pressed','false');
  if (message) status.textContent = message;
}
function schedule() {
  timer = setTimeout(() => {
    drop(Math.random(),Math.random()); count++;
    if (count >= 60) stop('Regnet är klart: 60 droppar. Starta en ny omgång när du vill.');
    else schedule();
  }, Number(tempo.value));
}
rain.addEventListener('click', () => {
  if (timer !== null) { stop('Regnet stoppat.'); return; }
  count = 0; rain.textContent = 'Stoppa regn'; rain.setAttribute('aria-pressed','true');
  status.textContent = 'Regnet spelar högst 60 droppar.'; schedule();
});
sound.addEventListener('click', async () => {
  if (audible) {
    audible = false; silence();
    sound.textContent = 'Slå på ljud'; sound.setAttribute('aria-pressed','false');
    status.textContent = 'Ljudet är av.'; return;
  }
  sound.disabled = true;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('unsupported');
    audio ??= new Audio();
    await audio.resume();
    if (document.hidden) return;
    audible = true; sound.textContent = 'Stäng av ljud'; sound.setAttribute('aria-pressed','true');
    status.textContent = 'Ljudet är på. Kasta en droppe.';
  } catch { status.textContent = 'Ljud kunde inte startas. Du kan fortfarande skapa ringar.'; }
  finally { sound.disabled = false; }
});
canvas.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const rect = canvas.getBoundingClientRect();
  drop(Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)), Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height)));
});
canvas.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(.5,.5); }
});
function clear() {
  stop('Tyst vatten.'); silence(); rings = [];
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null; draw(performance.now());
}
document.querySelector('#clear').addEventListener('click',clear);
tempo.addEventListener('input', () => { document.querySelector('#interval').textContent = `${tempo.value} ms`; });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clear();
});
window.addEventListener('resize',resize);
resize();
