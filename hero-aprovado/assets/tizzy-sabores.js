import * as THREE from './tz-three.js';
import { EffectComposer } from './tz-vendor-postprocessing-EffectComposer.js';
import { RenderPass } from './tz-vendor-postprocessing-RenderPass.js';
import { BokehPass } from './tz-vendor-postprocessing-BokehPass.js';
import { UnrealBloomPass } from './tz-vendor-postprocessing-UnrealBloomPass.js';
import { OutputPass } from './tz-vendor-postprocessing-OutputPass.js';
import { ShaderPass } from './tz-vendor-postprocessing-ShaderPass.js';
import { MarchingCubes } from './tz-vendor-objects-MarchingCubes.js';
import {loadAnimationLibraries} from './tizzy-hero.js';
const flavorInstances=new Map();
export function mount(scope=document){const roots=[...(scope.matches?.('[data-tz-flavors]')?[scope]:[]),...scope.querySelectorAll('[data-tz-flavors]')];for(const root of roots){if(!root.isConnected||flavorInstances.has(root))continue;setup(root).catch(error=>{if(error.name!=='AbortError'){root.querySelector('.tz-stage')?.classList.add('no-gl');console.warn('[TIZZY sabores]',error.message)}})}}
async function setup(flavorRoot){




const life=new AbortController(),pendingFrames=new Set(),pendingTimers=new Set(),cleanups=[];
let disposed=false;
const Image=class extends window.Image{constructor(){super();cleanups.push(()=>{this.onload=null;this.onerror=null;this.src=''})}};
const requestAnimationFrame=cb=>{if(disposed)return 0;const id=window.requestAnimationFrame(t=>{pendingFrames.delete(id);if(!disposed)cb(t)});pendingFrames.add(id);return id};
const setTimeout=(cb,ms)=>{if(disposed)return 0;const id=window.setTimeout(()=>{pendingTimers.delete(id);if(!disposed)cb()},ms);pendingTimers.add(id);return id};
const addEventListener=(type,cb,options={})=>window.addEventListener(type,cb,{...options,signal:life.signal});
const destroy=()=>{if(disposed)return;disposed=true;life.abort();pendingFrames.forEach(id=>window.cancelAnimationFrame(id));pendingTimers.forEach(id=>window.clearTimeout(id));cleanups.forEach(fn=>{try{fn()}catch{}});window.gsap?.killTweensOf(flavorRoot.querySelectorAll('*'));window.ScrollTrigger?.getAll().forEach(t=>{if(t.trigger&&(t.trigger===flavorRoot||flavorRoot.contains(t.trigger)))t.kill()});window.__tzSlot=null;flavorRoot.removeAttribute('data-gl-ready');flavorInstances.delete(flavorRoot);};
flavorInstances.set(flavorRoot,{destroy});
document.addEventListener('shopify:section:unload',event=>{if(event.target===flavorRoot||event.target.contains(flavorRoot))destroy()},{signal:life.signal});
const TZ_ASSETS=JSON.parse(flavorRoot.querySelector('[data-tz-flavor-assets]').textContent);
const flavorCfg=JSON.parse(flavorRoot.querySelector('[data-tz-flavor-config]').textContent);
await loadAnimationLibraries(flavorCfg);if(disposed)return;
const TZ_INLINE={"assets/render/caixa/seq.json": {"n": 102, "start": 1, "pad": 4, "path": "assets/render/caixa/caixa_", "ext": ".webp", "w": 704, "h": 1248, "box": [0.7272727272727273, 0.7628205128205128]}, "assets/render/embalagem/giro.json": {"n": 47, "w": 540, "h": 940}, "assets/render/cenas/uva/trajeto/seq.json": {"n": 30, "w": 1440, "h": 810, "heart": [[0.6008, 0.5099, 0.2029, 0.2523], [0.6005, 0.5091, 0.2029, 0.2508], [0.5998, 0.5084, 0.2031, 0.2466], [0.5986, 0.5077, 0.2033, 0.2397], [0.597, 0.507, 0.2036, 0.2304], [0.595, 0.5064, 0.204, 0.219], [0.5925, 0.5057, 0.2044, 0.2056], [0.5898, 0.5051, 0.2049, 0.1906], [0.5867, 0.5044, 0.2054, 0.174], [0.5833, 0.5037, 0.206, 0.1561], [0.5796, 0.503, 0.2067, 0.1371], [0.5757, 0.5023, 0.2074, 0.1173], [0.5716, 0.5015, 0.2082, 0.0968], [0.5673, 0.5007, 0.209, 0.0758], [0.5629, 0.4999, 0.2098, 0.0546], [0.5584, 0.499, 0.2107, 0.0334], [0.5539, 0.4981, 0.2116, 0.0124], [0.5493, 0.4971, 0.2126, -0.0083], [0.5448, 0.4961, 0.2135, -0.0284], [0.5404, 0.4951, 0.2144, -0.0478], [0.5361, 0.494, 0.2153, -0.0662], [0.5321, 0.4929, 0.2162, -0.0835], [0.5283, 0.4917, 0.217, -0.0995], [0.5248, 0.4906, 0.2178, -0.114], [0.5217, 0.4894, 0.2185, -0.1267], [0.519, 0.4882, 0.2191, -0.1376], [0.5169, 0.4869, 0.2196, -0.1463], [0.5153, 0.4857, 0.22, -0.1528], [0.5143, 0.4845, 0.2202, -0.1569], [0.5139, 0.4833, 0.2203, -0.1583]]}, "assets/render/gomas/coracao-uva/giro.json": {"n": 36, "w": 736, "h": 696, "heart": [15, 58, 718, 687]}};
const tzResolve=url=>TZ_ASSETS[url.split('?')[0]]||url;
const tzFetch=(url,options)=>TZ_INLINE[url]?Promise.resolve(new Response(JSON.stringify(TZ_INLINE[url]),{headers:{'Content-Type':'application/json'}})):fetch(tzResolve(url),{...options,signal:life.signal});

const { gsap, ScrollTrigger } = window;
const ownTweens=new Set();const track=t=>{ownTweens.add(t);return t};cleanups.push(()=>ownTweens.forEach(t=>t.kill()));
gsap.registerPlugin(ScrollTrigger);


await new Promise((resolve,reject)=>{life.signal.addEventListener('abort',()=>reject(new DOMException('Section unloaded','AbortError')),{once:true});const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){obs.disconnect();resolve()}},{rootMargin:'150% 0px'});obs.observe(flavorRoot);cleanups.push(()=>obs.disconnect())});
if(disposed)throw new DOMException('Section unloaded','AbortError');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const $ = (s, r = flavorRoot) => r.matches?.(s)?r:r.querySelector(s);
const $$ = (s, r = flavorRoot) => [...r.querySelectorAll(s)];
const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));

/* ================= dados ================= */
const SX = [0, 18, 36, 54, 72];
const SET = [
  { wall: '#E4946A', css: '#E8A07A', ped: '#D27E55', ink: '#1E2A36' },
  { wall: '#5A2F72', css: '#5E3376', ped: '#4A2260', ink: '#F4EDE4' },
  { wall: '#5A2F72', css: '#5E3376', ped: '#4A2260', ink: '#F4EDE4' },
  { wall: '#5A2F72', css: '#5E3376', ped: '#4A2260', ink: '#F4EDE4' },
  { wall: '#A9C3DE', css: '#AFC8E1', ped: '#8AA9CB', ink: '#1E2A36' },
];
const FLV = [
  { name: 'abacaxi', gum: '#F5C63A', dot: '#E7B92E', img: 'coracao-abacaxi-03.png', label: 'Abacaxi' },
  { name: 'maçã verde', gum: '#4FA324', dot: '#6FB23A', img: 'coracao-maca-verde-03.png', label: 'Maçã verde' },
  { name: 'uva', gum: '#7A2A9E', dot: '#B58ACB', img: 'coracao-uva-03.png', label: 'Uva' },
];
const HOLDS = [[0, .08], [.17, .33], [.40, .55], [.62, .78], [.88, 1]];
const ACT_P = [0, .25, .475, .70, .95];

/* ================= DOM ================= */
const stageWrap = $('#tz-launch'), stage = $('#tz-stage'), canvas = $('#tz-canvas');
const acts = $$('.tz-act');

// abas de sabor (texto + ponto de cor)
$$('.tz-tabs').forEach((tabs, ai) => {
  FLV.forEach((f, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(i === ai)); b.tabIndex = i === ai ? 0 : -1;
    b.innerHTML = `<i style="--c:${f.dot}"></i>${f.label}`;
    b.addEventListener('click', () => scrollToP(ACT_P[i + 1]));
    tabs.appendChild(b);
  });
});

function wrapWords(el) {
  const walk = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(pt => {
          if (!pt) return;
          if (/^\s+$/.test(pt)) { frag.appendChild(document.createTextNode(' ')); return; }
          const m = document.createElement('span'); m.className = 'm';
          const i = document.createElement('span'); i.className = 'mi'; i.textContent = pt;
          m.appendChild(i); frag.appendChild(m);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1) walk(ch);
    });
  };
  walk(el);
}
$$('[data-reveal]').forEach(wrapWords);
function reveal(root) {
  if (reduce) return;
  track(gsap.fromTo($$('.mi', root), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .05, overwrite: true }));
  track(gsap.fromTo($$('.tz-eyebrow,.tz-lede,.tz-notes div,.tz-row,.tz-tabs,.tz-draw', root), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .06, delay: .2, overwrite: true }));
}
function scrollToP(p) { window.scrollTo({ top: stageWrap.getBoundingClientRect().top + scrollY + p * (stageWrap.offsetHeight - innerHeight), behavior: reduce ? 'auto' : 'smooth' }); }
$$('[data-go]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); scrollToP(ACT_P[+b.dataset.go]); }));
$$('[data-jump]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const t = document.getElementById(b.dataset.jump); if (t) window.scrollTo({ top: t.offsetTop, behavior: reduce ? 'auto' : 'smooth' }); }));

const pointer = { nx: 0, ny: 0 };
addEventListener('pointermove', e => { pointer.nx = e.clientX / innerWidth * 2 - 1; pointer.ny = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });

/* ================= scroll ================= */
let targetP = 0, P = 0;
ScrollTrigger.create({ trigger: stageWrap, start: 'top top', end: 'bottom bottom', onUpdate: s => { targetP = s.progress; } });
const setOnSab = () => flavorRoot.classList.toggle('on-sab', stageWrap.getBoundingClientRect().top < 64);
addEventListener('scroll', setOnSab, { passive: true }); setOnSab();

function actWeights(p) {
  const w = [1 - smooth(.045, .09, p)];
  for (let i = 1; i <= 3; i++) { const [a, b] = HOLDS[i]; w.push(smooth(a - .045, a + .005, p) * (1 - smooth(b, b + .045, p))); }
  w.push(smooth(.835, .885, p));
  return w;
}
function inkBlend(p) {
  const T = [[.08, .17], [.33, .40], [.55, .62], [.78, .88]];
  for (let i = 0; i < 4; i++) { const m = (T[i][0] + T[i][1]) / 2; if (p < m + .01) return [i, i + 1, smooth(m - .01, m + .01, p)]; }
  return [4, 4, 0];
}
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };


/* cena Uva renderizada no Blender: fundo fixo + coração girando (sequência) no lugar exato do coração da cena.
   O movimento imita a câmera do estúdio: entra deslizando como a câmera que viaja de um set para o outro,
   faz a deriva lenta durante o sabor (com o coração em primeiro plano se movendo um pouco mais) e sai subindo para o trio. */
const PLATE = (() => {
  const el = $('#tz-plate-uva'); if (!el) return null;
  const inner = el.querySelector('.tz-plate-in'), shade = el.querySelector('i'), cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
  const HEART = { cx: .5592, cy: .5065, w: .2263 };      // medido na "Camera Cena" do Blender (fração do quadro 16:9)
  const seqs = {};
  const load = pre => seqs[pre] || (seqs[pre] = tzFetch('assets/render/gomas/coracao-uva/' + pre + '.json').then(r => r.json()).then(M => {
    M.frames = [];
    for (let i = 0; i < M.n; i++) { const im = new Image(); im.onload = () => { M.frames[i] = im; }; im.src = tzResolve('assets/render/gomas/coracao-uva/' + pre + '_' + String(i + 1).padStart(4, '0') + '.webp'); }
    return M;
  }));
  let M = null, pre = null, cur = -1, lastKey = '';
  const use = p => { pre = p; load(p).then(m => { if (pre === p) { M = m; cur = -1; } }); };
  use('giro');
  const kick = { a: 0, t: -10 };
  const state = { on: false, gl: false, frame: -1 };
  // trajeto de câmera renderizado no Blender (se existir): quadros + posição do coração em cada quadro
  const TRAJ = { n: 0, heart: null, frames: [] };
  tzFetch('assets/render/cenas/uva/trajeto/seq.json').then(r => r.ok ? r.json() : null).then(M => {
    if (!M) return;
    TRAJ.heart = M.heart; TRAJ.w = M.w; TRAJ.h = M.h;
    const order = []; for (const st of [8, 4, 2, 1]) for (let i = 0; i < M.n; i += st) if (!order.includes(i)) order.push(i);
    order.forEach(i => { const im = new Image(); im.onload = () => { TRAJ.frames[i] = im; }; im.src = tzResolve('assets/render/cenas/uva/trajeto/fundo_' + String(i + 1).padStart(4, '0') + '.webp'); });
    TRAJ.n = M.n;
  }).catch(() => {});
  const sm = (a, b, x) => { const q = Math.min(1, Math.max(0, (x - a) / (b - a))); return q * q * (3 - 2 * q); };
  function update(p, t) {
    if (('giro') !== pre) use('giro');
    // DEMO: a cena Uva ocupa os três sabores. Entra no sabor 01 e sai depois do sabor 03;
    // entre um sabor e outro a câmera recomeça o trajeto com uma troca rápida (desliza e reaparece)
    const SEG = [[.105, .365], [.365, .585], [.585, .86]];
    const enter = sm(.105, .175, p), leave = sm(.78, .86, p);
    let seg = 0; while (seg < 2 && p >= SEG[seg][1]) seg++;
    const u = Math.min(1, Math.max(0, (p - SEG[seg][0]) / (SEG[seg][1] - SEG[seg][0])));
    let swapQ = 1, swapSide = 0;
    for (const b of [.365, .585]) { const d = Math.abs(p - b); if (d < .03) { swapQ = d / .03; swapSide = p < b ? -1 : 1; } }
    const on = enter > 0 && leave < 1;
    el.style.visibility = on ? 'visible' : 'hidden';
    state.on = on;
    if (!on) return;
    const W = el.clientWidth, H = el.clientHeight, ar = 16 / 9;
    const hold = u;
    const m = reduce ? 0 : 1;
    // com o trajeto renderizado, quem se move é a câmera do Blender; sem ele, simulamos aproximação e deriva
    const traj = TRAJ.n > 0;
    const push = traj ? 1 : 1.06 - .045 * hold * m;
    const tx = (1 - enter) * W * m - (traj ? 0 : (hold - .5) * W * .025 * m) + swapSide * (1 - swapQ) * W * .3 * m;
    const ty = -leave * H * .35 * m;
    inner.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${push.toFixed(4)})`;
    inner.style.opacity = String(swapQ);
    el.style.opacity = reduce ? String(enter * (1 - leave)) : String(Math.min(1, enter * 1.6) * (1 - leave));
    shade.style.opacity = String(enter * (1 - leave));
    // área da imagem com object-fit: cover
    const dw = W / H > ar ? W : H * ar, dh = dw / ar, ox = (W - dw) / 2, oy = (H - dh) / 2;
    // o coração está mais perto da câmera: move um pouco mais que o fundo (paralaxe) e flutua
    const par = (traj ? 0 : -(hold - .5) * W * .012 * m) + (1 - enter) * W * .08 * m;
    // quadro do trajeto (a rolagem percorre todo o tempo em que a cena está na tela) e coração daquele quadro
    let hc = HEART, az = 0;
    if (traj) {
      const ff = u * (TRAJ.n - 1), i0 = Math.floor(ff), i1 = Math.min(TRAJ.n - 1, i0 + 1), fr = ff - i0;
      const A = TRAJ.heart[i0], B = TRAJ.heart[i1], L = (k) => A[k] + (B[k] - A[k]) * fr;
      hc = { cx: L(0), cy: L(1), w: L(2) }; az = L(3);
      let fi = Math.round(ff); while (fi > 0 && !TRAJ.frames[fi]) fi--;
      state.frame = TRAJ.frames[fi] ? fi : -1; state.img = TRAJ.frames[fi] || null;
    }
    const bob = m * Math.sin(t * 1.0) * dh * .007;
    const dk = t - kick.t, sq = m * kick.a * .2 * Math.exp(-4.5 * dk) * Math.cos(17 * dk);
    // rotação conduzida pela rolagem e um leve balanço, como os corações do estúdio
    let a = (p - ACT_P[seg + 1]) * 3.2 + m * Math.sin(t * .45) * .38;
    Object.assign(state, { W, H, dw, dh, ox, oy, X: ox + hc.cx * dw + par, Y: oy + hc.cy * dh + bob, wpx: hc.w * dw, a: a - az, sq, tilt: m * Math.sin(t * .6) * .06 });
    if (state.gl) { cv.style.display = 'none'; return; }   // o coração 3D do estúdio desenha por cima (WebGL)
    if (!M) return;
    const hw = M.heart[2] - M.heart[0], k = hc.w * dw / hw;
    const cw = Math.round(M.w * k), ch = Math.round(M.h * k), dpr = Math.min(devicePixelRatio || 1, 2);
    const key = cw + 'x' + ch + '@' + dpr;
    if (key !== lastKey) { cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); cv.style.width = cw + 'px'; cv.style.height = ch + 'px'; lastKey = key; cur = -1; }
    const hx = ((M.heart[0] + M.heart[2]) / 2) * k, hy = ((M.heart[1] + M.heart[3]) / 2) * k;
    cv.style.transform = `translate3d(${(state.X - hx).toFixed(1)}px,${(state.Y - hy).toFixed(1)}px,0) scale(${(1 + sq * .5).toFixed(4)},${(1 - sq).toFixed(4)})`;
    cv.style.transformOrigin = `${hx}px ${hy + ((M.heart[3] - M.heart[1]) / 2) * k}px`;
    a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const i = Math.round(a / (Math.PI * 2) * M.n) % M.n, im = M.frames[i];
    if (im && i !== cur) { ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(im, 0, 0, cv.width, cv.height); cur = i; }
  }
  return { update, state, el, inner, kick: (a = .7) => { kick.a = a; kick.t = performance.now() / 1000; } };
})();

let activeAct = -1;
function updateDOM(p) {
  const [a, b, m] = inkBlend(p);
  const ink = mixHex(SET[a].ink, SET[b].ink, m);
  stage.style.setProperty('--ink', ink);
  stage.style.setProperty('--bg', mixHex(SET[a].css, SET[b].css, m));
  flavorRoot.style.setProperty('--hdr-ink', stageWrap.getBoundingClientRect().bottom > 64 ? ink : '#1E2A36');
  const w = actWeights(p);
  let best = 0;
  acts.forEach((el, i) => {
    el.style.opacity = w[i].toFixed(3);
    const off = w[i] < .04;
    if (el.inert !== off) el.inert = off;
    if (w[i] > w[best]) best = i;
  });
  if (PLATE) PLATE.update(p, performance.now() / 1000);
  if (w[best] > .5 && best !== activeAct) {
    activeAct = best; reveal(acts[best]);
    if (GL && best >= 1 && best <= 3) GL.kickSet(best - 1);
    if (PLATE && best >= 1 && best <= 3) setTimeout(() => PLATE.kick(.8), 250);
  }
}

/* números, barras */
$$('.tz-num b').forEach(el => {
  const to = parseFloat(el.dataset.to); if (reduce || !to) return;
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.fromTo(o, { v: 0 }, { v: to, duration: 1.6, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
});
if (!reduce && flavorRoot.querySelector('.tz-specs')) {
  track(gsap.from('.tz-specs li', { y: 28, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.tz-specs', start: 'top 82%', once: true } }));
  track(gsap.fromTo('[data-fill]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#tz-compare', start: 'top 75%', end: 'top 30%', scrub: .8 } }));
  track(gsap.to('#tz-offer-img', { y: -12, rotate: .8, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
  track(gsap.fromTo('#tz-offer .cl', { xPercent: -4 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: '#tz-offer', start: 'top bottom', end: 'bottom top', scrub: true } }));
}

/* ================= WebGL ================= */
let GL = null;let domLoading=true;const updateLoading=()=>{if(!domLoading||disposed)return;const real=clamp01(-stageWrap.getBoundingClientRect().top/Math.max(1,stageWrap.offsetHeight-innerHeight));const poster=stage.querySelector('.tz-landing-poster');if(poster)poster.hidden=document.querySelector('[data-tz-hero]')?.dataset.mode==='3d'||stage.getBoundingClientRect().top>innerHeight*.015&&document.querySelector('[data-tz-hero]')?.dataset.mode!=='static';targetP=real;P=reduce?real:P+(real-P)*.12;updateDOM(P);requestAnimationFrame(updateLoading)};updateDOM(0);updateLoading();
try { if(!reduce&&flavorCfg.mode!=='static')GL = await initGL();else stage.classList.add('no-gl'); }
catch (err) { if(disposed)return;console.warn('[tizzy] WebGL indisponível:', err); stage.classList.add('no-gl'); window.__tzSlot = null; }
domLoading=false;
if (!GL) { (function loop() { P = reduce ? targetP : P + (targetP - P) * .12; updateDOM(P); requestAnimationFrame(loop); })(); }

async function initGL() {
  const pctEl = $('#tz-pct');
  const setPct = v => { pctEl.textContent = Math.round(v); };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  cleanups.push(()=>renderer.dispose());canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stage.classList.add('no-gl');flavorRoot.dataset.glReady='false';window.__tzSlot=null;canvas.hidden=true;const poster=stage.querySelector('.tz-landing-poster');if(poster)poster.hidden=false},{signal:life.signal});
  let dpr = Math.min(devicePixelRatio, fine ? 1.25 : 1);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  try { await Promise.race([document.fonts.load('800 100px "Bricolage Grotesque"'), new Promise(r => setTimeout(r, 3000))]); } catch (e) {}
  setPct(8); await nextFrame();

  const scene = new THREE.Scene();
  cleanups.push(()=>scene.traverse(o=>{o.geometry?.dispose();[].concat(o.material||[]).forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)v.dispose()});m.dispose()})}));
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 200);
  scene.add(camera);
  const texL = new THREE.TextureLoader();
  const loadTex = url => new Promise((res,reject) => {const abort=()=>reject(new DOMException('Section unloaded','AbortError'));if(disposed){abort();return;}life.signal.addEventListener('abort',abort,{once:true});texL.load(tzResolve(url), t => { if(disposed){t.dispose();res(null);return;}t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }, undefined, () => res(null));});

  /* ---------- ambiente de estúdio ---------- */
  {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(.04, .045, .06), side: THREE.BackSide })));
    const box = (w, h, pos, look, k, tint = [1, 1, 1]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint[0] * k, tint[1] * k, tint[2] * k), side: THREE.DoubleSide }));
      m.position.set(...pos); m.lookAt(...look); env.add(m);
    };
    box(7, 5, [-6, 7, 7], [0, 0, 0], 7);
    box(1.6, 9, [8, 2, 2], [0, 1, 0], 9);
    box(10, 10, [0, 9.5, 0], [0, 0, 0], 1.8, [.82, .9, 1]);
    box(1.2, 7, [-5, 3, -8], [0, 1, 0], 6);
    box(12, 12, [0, -9.5, 0], [0, 0, 0], .9, [1, .7, .5]);
    const pm = new THREE.PMREMGenerator(renderer);
    const environment=pm.fromScene(env,.02,.1,100);scene.environment=environment.texture;cleanups.push(()=>environment.dispose());pm.dispose();env.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
    scene.environmentIntensity = .5;
  }
  const hemi = new THREE.HemisphereLight('#EAF4FE', '#FF8A3D', 1.35); scene.add(hemi);
  const spot = new THREE.SpotLight('#FFF1E0', 3.0, 0, .62, 1, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(fine ? 1024 : 512, fine ? 1024 : 512);
  spot.shadow.radius = 14; spot.shadow.blurSamples = 22; spot.shadow.bias = -.0004;
  spot.shadow.camera.near = 2; spot.shadow.camera.far = 48;
  scene.add(spot, spot.target);
  const kicker = new THREE.PointLight('#ffffff', .5, 0, 0); camera.add(kicker);

  /* ---------- ciclorama ---------- */
  const wallColors = SET.map(s => new THREE.Color(s.wall));
  function wallColorAt(x, out) {
    for (let i = 0; i < SX.length - 1; i++) {
      if (x <= SX[i + 1] || i === SX.length - 2) { const mid = (SX[i] + SX[i + 1]) / 2; return out.copy(wallColors[i]).lerp(wallColors[i + 1], smooth(mid - 3, mid + 3, x)); }
    }
    return out.copy(wallColors[0]);
  }
  {
    const prof = [];
    for (let i = 0; i <= 24; i++) prof.push([lerp(34, -4, i / 24), 0]);
    for (let i = 1; i <= 20; i++) { const t = i / 20 * Math.PI / 2; prof.push([-4 - 4 * Math.sin(t), 4 - 4 * Math.cos(t)]); }
    for (let i = 1; i <= 10; i++) prof.push([-8, lerp(4, 40, i / 10)]);
    const NX = 300, X0 = -36, X1 = 110, NP = prof.length;
    const pos = new Float32Array((NX + 1) * NP * 3), col = new Float32Array((NX + 1) * NP * 3), idx = [];
    const c = new THREE.Color();
    for (let i = 0; i <= NX; i++) {
      const x = lerp(X0, X1, i / NX); wallColorAt(x, c);
      for (let j = 0; j < NP; j++) {
        const k = (i * NP + j) * 3;
        pos[k] = x; pos[k + 1] = prof[j][1]; pos[k + 2] = prof[j][0];
        col[k] = c.r; col[k + 1] = c.g; col[k + 2] = c.b;
        if (i < NX && j < NP - 1) { const a = i * NP + j, b = a + NP; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    const cyc = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .94, metalness: 0 }));
    cyc.receiveShadow = true; scene.add(cyc);
  }
  setPct(16); await nextFrame();

  /* ---------- gomas ---------- */
  function heartShape() {
    const s = new THREE.Shape();
    s.moveTo(0, -1.0);
    s.bezierCurveTo(-.4, -.64, -1.1, -.22, -1.1, .32);
    s.bezierCurveTo(-1.1, .78, -.76, 1.04, -.47, 1.04);
    s.bezierCurveTo(-.2, 1.04, -.05, .88, 0, .66);
    s.bezierCurveTo(.05, .88, .2, 1.04, .47, 1.04);
    s.bezierCurveTo(.76, 1.04, 1.1, .78, 1.1, .32);
    s.bezierCurveTo(1.1, -.22, .4, -.64, 0, -1.0);
    return s;
  }
  function upperLip() {
    const s = new THREE.Shape();
    s.moveTo(-1.15, .0);
    s.bezierCurveTo(-.9, .24, -.6, .62, -.33, .62);
    s.bezierCurveTo(-.16, .62, -.08, .5, 0, .46);
    s.bezierCurveTo(.08, .5, .16, .62, .33, .62);
    s.bezierCurveTo(.6, .62, .9, .24, 1.15, .0);
    s.bezierCurveTo(.64, .08, .27, -.04, 0, .03);
    s.bezierCurveTo(-.27, -.04, -.64, .08, -1.15, .0);
    return s;
  }
  function lowerLip() {
    const s = new THREE.Shape();
    s.moveTo(-1.12, -.02);
    s.bezierCurveTo(-.64, .05, -.27, -.07, 0, -.01);
    s.bezierCurveTo(.27, -.07, .64, .05, 1.12, -.02);
    s.bezierCurveTo(.84, -.48, .44, -.78, 0, -.78);
    s.bezierCurveTo(-.44, -.78, -.84, -.48, -1.12, -.02);
    return s;
  }
  function sdf2D(shape, N, E) {
    const pts = shape.getSpacedPoints(280);
    const ax = [], ay = [], bx = [], by = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 < 1e-10) continue;
      ax.push(a.x); ay.push(a.y); bx.push(b.x); by.push(b.y);
    }
    const n = ax.length, g = new Float32Array(N * N);
    for (let j = 0; j < N; j++) {
      const y = -E + 2 * E * j / (N - 1);
      for (let i = 0; i < N; i++) {
        const x = -E + 2 * E * i / (N - 1);
        let dmin = 1e9, inside = false;
        for (let k = 0; k < n; k++) {
          const ex = bx[k] - ax[k], ey = by[k] - ay[k], wx = x - ax[k], wy = y - ay[k];
          let t = (wx * ex + wy * ey) / (ex * ex + ey * ey); t = t < 0 ? 0 : t > 1 ? 1 : t;
          const dx = wx - ex * t, dy = wy - ey * t, d = dx * dx + dy * dy;
          if (d < dmin) dmin = d;
          if ((ay[k] > y) !== (by[k] > y) && x < ex * (y - ay[k]) / ey + ax[k]) inside = !inside;
        }
        g[j * N + i] = (inside ? -1 : 1) * Math.sqrt(dmin);
      }
    }
    const tmp = new Float32Array(N * N);
    for (let pass = 0; pass < 2; pass++) {
      for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
        let s = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) s += g[(j + dj) * N + i + di];
        tmp[j * N + i] = s / 9;
      }
      for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) g[j * N + i] = tmp[j * N + i];
    }
    return (x, y) => {
      const fx = (x + E) / (2 * E) * (N - 1), fy = (y + E) / (2 * E) * (N - 1);
      if (fx < 0 || fy < 0 || fx >= N - 1 || fy >= N - 1) return 1;
      const i = fx | 0, j = fy | 0, tx = fx - i, ty = fy - j, q = j * N + i;
      return lerp(lerp(g[q], g[q + 1], tx), lerp(g[q + N], g[q + N + 1], tx), ty);
    };
  }
  function pillow(d, z, Hm, R, rr) {
    const s = Math.max(-d, 0);
    const h = Hm * (.4 + .6 * (1 - Math.exp(-2.6 * s / R)));
    const a = d + rr, b = Math.abs(z) - h + rr;
    const ma = Math.max(a, 0), mb = Math.max(b, 0);
    return Math.sqrt(ma * ma + mb * mb) + Math.min(Math.max(a, b), 0) - rr;
  }
  function marchGeometry(fieldFn, res, E) {
    const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 180000);
    mc.isolation = 0;
    const f = mc.field, h = mc.halfsize;
    for (let z = 0; z < res; z++) {
      const wz = (z - h) / h * E;
      for (let y = 0; y < res; y++) {
        const wy = (y - h) / h * E;
        for (let x = 0; x < res; x++) {
          const wx = (x - h) / h * E;
          f[x + y * res + z * res * res] = -fieldFn(wx, wy, wz) * 60;
        }
      }
    }
    mc.update();
    const n = mc.count;
    const pos = mc.geometry.attributes.position.array.slice(0, n * 3);
    const nor = mc.geometry.attributes.normal.array.slice(0, n * 3);
    for (let i = 0; i < n * 3; i++) pos[i] *= E;
    for (let i = 0; i < n; i++) { const k = i * 3, l = Math.hypot(nor[k], nor[k + 1], nor[k + 2]) || 1; nor[k] /= l; nor[k + 1] /= l; nor[k + 2] /= l; }
    mc.geometry.dispose();
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.computeBoundingBox();
    const c = new THREE.Vector3(); g.boundingBox.getCenter(c); g.translate(-c.x, -c.y, -c.z);
    g.computeBoundingSphere();
    return g;
  }

  const RES = fine ? 76 : 56, SDN = fine ? 180 : 140, E = 1.32;
  const sdHeart = sdf2D(heartShape(), SDN, E); setPct(30); await nextFrame();
  const heartGeo = marchGeometry((x, y, z) => pillow(sdHeart(x, y), z, .46, .62, .17), RES, E); setPct(46); await nextFrame();
  const sdUp = sdf2D(upperLip(), SDN, E); setPct(56); await nextFrame();
  const sdLo = sdf2D(lowerLip(), SDN, E); setPct(64); await nextFrame();
  const lipsGeo = marchGeometry((x, y, z) => Math.min(pillow(sdUp(x, y - .015), z, .38, .42, .15), pillow(sdLo(x, y + .035), z, .43, .5, .16)), RES, E);
  setPct(76); await nextFrame();

  const WHITE = new THREE.Color('#ffffff');
  function gumMat(hex, trans = 1) {
    const c = new THREE.Color(hex);
    const m = new THREE.MeshPhysicalMaterial({
      color: c, roughness: .13, metalness: 0, transmission: trans, thickness: trans < 1 ? .8 : 1.35, ior: 1.42,
      attenuationColor: c.clone().lerp(WHITE, .55), attenuationDistance: 1.1,
      clearcoat: .5, clearcoatRoughness: .06, specularIntensity: 1, dispersion: fine ? .3 : 0,
    });
    const u = { uTime: { value: 0 }, uAmp: { value: 0 }, uSeed: { value: Math.random() * 10 } };
    m.userData.u = u;
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = 'uniform float uTime; uniform float uAmp; uniform float uSeed; varying vec3 vOP;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vOP = position;
        float wob = sin(position.y * 3.1 + uTime * 15. + uSeed) * .6 + sin(position.x * 4.3 - uTime * 11.7 + uSeed * 2.) * .4;
        transformed += objectNormal * wob * uAmp;`);
      sh.fragmentShader = 'varying vec3 vOP;\n' + sh.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 q = vOP * 7.5;
        vec3 jit = vec3(sin(q.x + sin(q.y * 1.7)) * sin(q.z * 1.3 + q.y), sin(q.y + sin(q.z * 1.9)) * sin(q.x * 1.1 - q.z), sin(q.z + sin(q.x * 1.3)));
        normal = normalize(normal + jit * .028);`);
    };
    m.customProgramCacheKey = () => 'tz-gum';
    return m;
  }
  const lacquer = hex => new THREE.MeshPhysicalMaterial({ color: hex, roughness: .55, metalness: 0, clearcoat: .35, clearcoatRoughness: .4 });

  /* ---------- embalagem real (foto) ---------- */
  const [packTex, ...cloudTex] = await Promise.all(['assets/produto/embalagem.webp', 'assets/ceu/nuvem-topo.webp', 'assets/ceu/nuvem-cinco.webp', 'assets/ceu/nuvem-media.webp', 'assets/ceu/nuvem-baixa.webp', 'assets/ceu/nuvem-seis.webp', 'assets/ceu/bruma.webp', 'assets/ceu/nuvem-pequena.webp'].map(loadTex));
  const PACK_AR = packTex ? packTex.image.width / packTex.image.height : .675;
  const PH = 3.6;                      // altura da embalagem no cenário
  if (packTex) { packTex.anisotropy = renderer.capabilities.getMaxAnisotropy(); packTex.generateMipmaps = true; }
  const packMat = new THREE.MeshBasicMaterial({ map: packTex, alphaTest: .5, alphaToCoverage: true, toneMapped: false, side: THREE.DoubleSide, color: packTex ? '#ffffff' : '#FF6300' });
  const packGeo = new THREE.PlaneGeometry(PACK_AR * PH, PH);
  const heroConfig=document.querySelector('[data-tz-hero] [data-tz-config]');const packConfig=heroConfig?JSON.parse(heroConfig.textContent):{packGLB:flavorCfg.packGLB};
  const {GLTFLoader}=await import(new URL('./tz-GLTFLoader.js',import.meta.url).href);
  const response=await fetch(packConfig.packGLB,{signal:life.signal});if(!response.ok)throw Error('Embalagem GLB indisponível');
  const gltf=await new GLTFLoader().parseAsync(await response.arrayBuffer(),new URL('.',new URL(packConfig.packGLB,document.baseURI)).href);
  if(disposed){gltf.scene.traverse(o=>{o.geometry?.dispose();[].concat(o.material||[]).forEach(m=>{Object.values(m).forEach(v=>v?.isTexture&&v.dispose());m.dispose()})});throw new DOMException('Section unloaded','AbortError');}const sourcePack=gltf.scene,bounds=new THREE.Box3().setFromObject(sourcePack),center=bounds.getCenter(new THREE.Vector3()),extent=bounds.getSize(new THREE.Vector3());
  sourcePack.position.sub(center);const sized=new THREE.Group();sized.add(sourcePack);sized.scale.setScalar(PH/extent.y);
  const heroPack=new THREE.Group();heroPack.add(sized);heroPack.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const LAND = new THREE.Vector3(.8, .22 + PH / 2, .3);
  heroPack.position.copy(LAND); scene.add(heroPack);
  const T = SX[4];
  const trioPack = heroPack.clone(true);
  trioPack.rotation.order = 'YXZ'; trioPack.rotation.set(-Math.PI / 2, .5, 0);
  trioPack.scale.setScalar(.9); trioPack.position.set(T + .1, .035, -.45); trioPack.castShadow = true; scene.add(trioPack);
  {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 8, 64, 64, 64); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(PACK_AR * PH * 1.25, PH * 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    blob.rotation.order = 'YXZ'; blob.rotation.set(-Math.PI / 2, .5, 0); blob.position.set(T + .25, .012, -.3); scene.add(blob);
  }

  /* ---------- nuvens no estúdio ---------- */
  const cloudPlanes = [];
  function addCloud(ti, pos, h, o = .95, mir = false, bill = false) {
    const t = cloudTex[ti]; if (!t) return;
    const ar = t.image.width / t.image.height;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(h * ar, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: o, toneMapped: false }));
    m.position.set(...pos); if (mir) m.scale.x = -1;
    m.userData = { base: new THREE.Vector3(...pos), seed: Math.random() * 6.28, bill };
    scene.add(m); cloudPlanes.push(m);
  }
  addCloud(0, [-6.2, 3.4, -6.8], 3.4); addCloud(1, [7.6, 4.6, -7.1], 4.2, .95, true); addCloud(2, [2.8, 6.9, -7.6], 1.7, .9);
  addCloud(3, [-9.5, 1.6, -6.3], 3.0, .9, true);
  for (let f = 0; f < 3; f++) { const X = SX[f + 1]; addCloud(2, [X - 4.8, 5.8, -7.7], 1.5, .85, f % 2 === 1); addCloud(6, [X + 4.6, 6.6, -7.7], 1.1, .8); }
  addCloud(5, [T - 6.2, 6.2, 3.2], 4.2, .4, false, true); addCloud(4, [T + 5.4, 5.4, -2.8], 3.0, .45, true, true);
  setPct(86); await nextFrame();

  /* ---------- montagem dos sets ---------- */
  const gummies = [], pickables = [heroPack, trioPack];
  const H = -Math.PI / 2;
  /* gomas renderizadas no Blender (Cycles): giro de 36 quadros, trocado conforme a rotação */
  const RENDERED = { '2-heart': 'coracao-uva' };
  const GSEQ = {};
  let GUM_PRE = 'giro';                 // 'giro' ou 'giro2': qual render do coração está no ar (comparação)
  const sprites = [];
  function gumSeq(key, pre) {
    const id = key + '/' + pre;
    if (GSEQ[id]) return GSEQ[id];
    const base = 'assets/render/gomas/' + key + '/';
    return GSEQ[id] = tzFetch(base + pre + '.json').then(r => r.json()).then(M => {
      M.frames = [];
      const load = i => new Promise(res => { const im = new Image(); im.onload = () => { M.frames[i] = im; res(); }; im.onerror = res; im.src = tzResolve(base + pre + '_' + String(i + 1).padStart(4, '0') + '.webp'); });
      M.ready = load(0).then(() => Promise.all(Array.from({ length: M.n - 1 }, (_, i) => load(i + 1))));
      return M;
    });
  }
  const gSize = heartGeo.boundingBox.max.x - heartGeo.boundingBox.min.x;

  /* ---------- cena Uva (fundo do Blender): o coração 3D do estúdio desenhado por cima, refratando o próprio fundo ---------- */
  let PG = null;
  if (PLATE && PLATE.el) {
    try {
      const pcv = document.createElement('canvas'); pcv.className = 'tz-plate-gl'; pcv.setAttribute('aria-hidden', 'true');
      PLATE.inner.appendChild(pcv);
      const r2 = new THREE.WebGLRenderer({ canvas: pcv, antialias: true, powerPreference: 'high-performance' });
      cleanups.push(()=>r2.dispose());
      r2.outputColorSpace = THREE.SRGBColorSpace; r2.toneMapping = THREE.NeutralToneMapping; r2.toneMappingExposure = 1.0;
      const s2 = new THREE.Scene();
      {
        const env = new THREE.Scene();
        env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(.04, .045, .06), side: THREE.BackSide })));
        const box = (w, h, pos, look, k, tint = [1, 1, 1]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint[0] * k, tint[1] * k, tint[2] * k), side: THREE.DoubleSide })); m.position.set(...pos); m.lookAt(...look); env.add(m); };
        box(7, 5, [-6, 7, 7], [0, 0, 0], 7); box(1.6, 9, [8, 2, 2], [0, 1, 0], 9); box(10, 10, [0, 9.5, 0], [0, 0, 0], 1.8, [.82, .9, 1]);
        box(1.2, 7, [-5, 3, -8], [0, 1, 0], 6); box(12, 12, [0, -9.5, 0], [0, 0, 0], .9, [1, .7, .5]);
        s2.environment = new THREE.PMREMGenerator(r2).fromScene(env, .02, .1, 100).texture; s2.environmentIntensity = .5;
      }
      s2.add(new THREE.HemisphereLight('#EAF4FE', '#B58ACB', 1.1));
      const key2 = new THREE.DirectionalLight('#FFF1E0', 2.2); key2.position.set(-4, 6, 8); s2.add(key2);
      const bgTex = await loadTex('assets/render/cenas/uva/fundo.webp');
      if (!bgTex) throw new Error('fundo');
      s2.background = bgTex;
      const tcv = document.createElement('canvas'), tctx = tcv.getContext('2d');
      const trajTex = new THREE.CanvasTexture(tcv); trajTex.colorSpace = THREE.SRGBColorSpace;
      const cam2 = new THREE.PerspectiveCamera(30, 1, .1, 100);
      const h2 = new THREE.Mesh(heartGeo, gumMat(FLV[2].gum, 1)); h2.rotation.order = 'YXZ'; s2.add(h2);
      PG = { r2, s2, cam2, h2, pcv, bgTex, trajTex, tcv, tctx, lastFrame: -2, key: '' };
      PLATE.state.gl = true;
      const im = PLATE.inner.querySelector('img'); if (im) im.style.visibility = 'hidden';
    } catch (e) { console.warn('[tizzy] coração 3D sobre a cena Uva indisponível', e); PG = null; }
  }
  function renderPlate(t) {
    const st = PLATE && PLATE.state;
    if (!PG || !st || !st.on || !st.W) return;
    const { r2, s2, cam2, h2, bgTex, trajTex, tcv, tctx } = PG, W = st.W, H = st.H;
    // fundo: quadro do trajeto (se houver) ou o fundo parado
    if (st.img && st.frame !== PG.lastFrame) {
      if (tcv.width !== st.img.naturalWidth) { tcv.width = st.img.naturalWidth; tcv.height = st.img.naturalHeight; }
      tctx.drawImage(st.img, 0, 0); trajTex.needsUpdate = true; PG.lastFrame = st.frame;
    }
    const bgNow = st.img ? trajTex : bgTex;
    if (s2.background !== bgNow) s2.background = bgNow;
    const pr = Math.min(devicePixelRatio || 1, fine ? 1.25 : 1), key = W + 'x' + H + '@' + pr;
    if (key !== PG.key) {
      r2.setPixelRatio(pr); r2.setSize(W, H, false); cam2.aspect = W / H; cam2.updateProjectionMatrix();
      // fundo em "cover", igual à imagem do site
      const car = W / H, iar = 16 / 9;
      for (const tx of [bgTex, trajTex]) {
        if (car > iar) { tx.repeat.set(1, iar / car); tx.offset.set(0, (1 - iar / car) / 2); }
        else { tx.repeat.set(car / iar, 1); tx.offset.set((1 - car / iar) / 2, 0); }
      }
      PG.key = key;
    }
    // posição/tamanho vindos da medição da câmera do Blender (em pixels da tela)
    const D = 10, visH = 2 * D * Math.tan(THREE.MathUtils.degToRad(cam2.fov / 2)), k = visH / H;
    h2.position.set((st.X - W / 2) * k, -(st.Y - H / 2) * k, -D);
    const sc = st.wpx * k / gSize;
    h2.scale.set(sc * (1 + st.sq * .5), sc * (1 - st.sq), sc * (1 + st.sq * .5));
    h2.rotation.set(.06 + st.tilt, st.a, -.05);
    const mu = h2.material.userData.u; mu.uTime.value = t; mu.uAmp.value = reduce ? 0 : .004 * (1 + Math.sin(t * 1.3));
    r2.render(s2, cam2);
  }
  function spriteGum(key) {
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: .4, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: .5 });
    mesh.visible = false;
    const sp = { cv, ctx, tex, cur: -1, seq: null, key };
    sp.use = pre => gumSeq(key, pre).then(M => M.ready.then(() => {
      if (pre !== GUM_PRE) return;
      if (cv.width !== M.w || cv.height !== M.h) { cv.width = M.w; cv.height = M.h; }
      // o coração do render fica com a mesma largura do coração 3D e centrado na origem
      const hw = M.heart[2] - M.heart[0], W = gSize * M.w / hw, k = W / M.w;
      const g = new THREE.PlaneGeometry(W, M.h * k);
      g.translate(-((M.heart[0] + M.heart[2]) / 2 - M.w / 2) * k, ((M.heart[1] + M.heart[3]) / 2 - M.h / 2) * k, 0);
      mesh.geometry.dispose(); mesh.geometry = g; sp.seq = M; sp.cur = -1;
    }));
    // o primeiro quadro aparece logo; o resto carrega por trás
    gumSeq(key, GUM_PRE).then(M => { if (sp.seq) return; cv.width = M.w; cv.height = M.h;
      const hw = M.heart[2] - M.heart[0], W = gSize * M.w / hw, k = W / M.w;
      const g = new THREE.PlaneGeometry(W, M.h * k);
      g.translate(-((M.heart[0] + M.heart[2]) / 2 - M.w / 2) * k, ((M.heart[1] + M.heart[3]) / 2 - M.h / 2) * k, 0);
      mesh.geometry.dispose(); mesh.geometry = g; sp.seq = M; });
    sprites.push(sp);
    return { mesh, sp };
  }
  function drawSprite(g) {
    const sp = g.userData.sprite, M = sp.seq; if (!M) return;
    let a = g.rotation.y % (Math.PI * 2); if (a < 0) a += Math.PI * 2;
    const i = Math.round(a / (Math.PI * 2) * M.n) % M.n, im = M.frames[i] || M.frames[sp.cur] || M.frames[0];
    if (im && i !== sp.cur) { sp.ctx.clearRect(0, 0, M.w, M.h); sp.ctx.drawImage(im, 0, 0); sp.tex.needsUpdate = true; sp.cur = M.frames[i] ? i : sp.cur; g.visible = true; }
    const roll = g.rotation.z; g.quaternion.copy(camera.quaternion); g.rotateZ(roll);
  }
  function addGummy(fi, shape, opts) {
    const rk = RENDERED[fi + '-' + shape], upright = opts.mode === 'hero' || opts.mode === 'float';
    if (rk && upright) {
      const { mesh, sp } = spriteGum(rk);
      mesh.castShadow = true; mesh.rotation.order = 'YXZ';
      mesh.userData = Object.assign({ f: fi, shape, kickT: -10, kickA: 0, sel: 0, seed: Math.random() * 6.28, sprite: sp }, opts);
      mesh.userData.base = { pos: new THREE.Vector3(...opts.pos), rot: new THREE.Euler(opts.rot[0], opts.rot[1], opts.rot[2], 'YXZ'), s: opts.s };
      scene.add(mesh); gummies.push(mesh); pickables.push(mesh);
      return mesh;
    }
    const mesh = new THREE.Mesh(shape === 'heart' ? heartGeo : lipsGeo, gumMat(FLV[fi].gum, opts.trans ?? 1));
    mesh.castShadow = true; mesh.rotation.order = 'YXZ';
    mesh.userData = Object.assign({ f: fi, shape, kickT: -10, kickA: 0, sel: 0, seed: Math.random() * 6.28 }, opts);
    mesh.userData.base = { pos: new THREE.Vector3(...opts.pos), rot: new THREE.Euler(opts.rot[0], opts.rot[1], opts.rot[2], 'YXZ'), s: opts.s };
    scene.add(mesh); gummies.push(mesh); pickables.push(mesh);
    return mesh;
  }
  const beads = [];
  function addBead(hex, pos, r) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), lacquer(hex));
    b.position.set(...pos); b.castShadow = true; b.userData = { y: pos[1], seed: Math.random() * 6.28 };
    scene.add(b); beads.push(b);
  }
  // set 0: pouso
  {
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, .22, 96), lacquer(SET[0].ped));
    plat.position.set(.8, .11, .3); plat.castShadow = plat.receiveShadow = true; scene.add(plat);
    addGummy(0, 'heart', { pos: [-.35, .55, 1.75], rot: [H, .45, 0], s: .72, mode: 'rest', land: 1, trans: .5 });
    addGummy(1, 'lips', { pos: [2.5, .53, 1.45], rot: [H, -.35, 0], s: .72, mode: 'rest', land: 1, trans: .5 });
    addGummy(2, 'lips', { pos: [1.05, .53, 2.5], rot: [H, 2.5, 0], s: .72, mode: 'rest', land: 1, trans: .5 });
    addGummy(1, 'heart', { pos: [-.8, 3.2, .55], rot: [.5, .15, .25], s: .66, mode: 'float', trans: .5 });
    addGummy(2, 'heart', { pos: [3.7, 2.35, 5.4], rot: [-.4, .25, -.2], s: .7, mode: 'float', trans: .5 });
    addGummy(0, 'lips', { pos: [3.0, 3.9, -.9], rot: [.6, -.2, .3], s: .62, mode: 'float', trans: .5 });
    addBead('#FFE300', [-1.6, .42, 2.8], .2); addBead('#FF6300', [3.6, .3, 2.6], .3); addBead('#FFFFFF', [4.4, 3.1, 3.8], .16);
  }
  // sets 1–3
  const numeralTex = n => {
    const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 1024); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '800 760px "Bricolage Grotesque", sans-serif'; x.fillText(n, 512, 560);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
  };
  for (let f = 0; f < 3; f++) {
    const X = SX[f + 1], S = SET[f + 1];
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.0, 96), lacquer(S.ped));
    ped.position.set(X + .15, .5, .3); ped.castShadow = ped.receiveShadow = true; scene.add(ped);
    const ped2 = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .46, 64), lacquer(S.ped));
    ped2.position.set(X - 1.85, .23, 1.45); ped2.castShadow = ped2.receiveShadow = true; scene.add(ped2);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.52, 64, 48), lacquer('#FFFFFF'));
    ball.position.set(X - 3.0, .52, -1.1); ball.castShadow = ball.receiveShadow = true; scene.add(ball);
    const wc = new THREE.Color(S.wall).lerp(WHITE, f === 2 ? .12 : .2);
    const num = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: wc, alphaMap: numeralTex('0' + (f + 1)), alphaTest: .5, roughness: .95 }));
    num.position.set(X + .6, 7.2, -7.96); num.receiveShadow = true; scene.add(num);
    addGummy(f, 'heart', { pos: [X - .55, 2.2, .25], rot: [.3, .05, -.12], s: 1.0, mode: 'hero', set: f });
    addGummy(f, 'lips', { pos: [X + .98, 1.58, .9], rot: [-.35, -.2, .08], s: .95, mode: 'hero', set: f });
    addBead(FLV[f].gum, [X + 2.7, 2.9, 4.3], .17); addBead(S.ped, [X - 2.9, 1.3, 3.9], .24); addBead(FLV[f].gum, [X - 1.45, 3.5, -1.6], .14);
    addBead('#FFFFFF', [X - .55, 1.09, 1.25], .09); addBead(S.ped, [X - 1.85, .7, 1.45], .22);
  }
  // set 4: flat lay
  const spill = [
    [0, 'heart', T + 1.9, -.55, .3], [1, 'lips', T + 2.95, -1.45, -.7], [2, 'heart', T + 2.6, .45, 1.2],
    [0, 'lips', T + 3.75, -.3, .15], [1, 'heart', T + 1.5, 1.2, -1.3], [2, 'lips', T + 3.45, 1.3, .8],
  ];
  const trioGums = spill.map(([f, sh, x, z, yaw]) => addGummy(f, sh, { pos: [x, .31, z], rot: [H + .06, yaw, .04], s: .67, mode: 'trio', trans: .5 }));
  addBead('#FFE300', [T + 4.5, .2, .9], .2); addBead('#FF6300', [T + .9, .16, 1.9], .16); addBead('#FFFFFF', [T + 2.3, .12, -2.3], .12);

  /* ---------- açúcar ---------- */
  const NP = 140, pPos = new Float32Array(NP * 3).fill(-999), pVel = new Float32Array(NP * 3), pLife = new Float32Array(NP);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.45, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const sugar = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: .07, map: dotTex, transparent: true, depthWrite: false }));
  sugar.frustumCulled = false; scene.add(sugar);
  let pCur = 0;
  function burst(pt, n = 40) {
    for (let k = 0; k < n; k++) {
      const i = pCur++ % NP, a = Math.random() * 6.283, e = Math.random() * 2 - 1, s = 1.8 + Math.random() * 3.6, r = Math.sqrt(1 - e * e);
      pPos.set([pt.x, pt.y, pt.z], i * 3); pVel.set([Math.cos(a) * r * s, Math.abs(e) * s + 1.6, Math.sin(a) * r * s], i * 3); pLife[i] = 1;
    }
  }
  setPct(92); await nextFrame();

  /* ---------- pós ---------- */
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 0 }));
  cleanups.push(()=>composer.dispose());
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0042, maxblur: .026 });
  bokeh.enabled = false; composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), .2, .55, .92);
  bloom.enabled = false; composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uGrain: { value: reduce ? .015 : .035 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uGrain; uniform vec2 uRes; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){
        vec2 c = vUv - .5; float r = dot(c, c);
        vec3 col = texture2D(tDiffuse, vUv).rgb;
        col *= 1. - .22 * smoothstep(.1, .62, r * 1.5);
        col += (hash(floor(vUv * uRes) + fract(uTime * 3.1) * 97.) - .5) * uGrain;
        gl_FragColor = vec4(col, 1.);
      }`,
  });
  composer.addPass(finish);

  /* ---------- câmera ---------- */
  let portrait = false;
  const V = (...a) => new THREE.Vector3(...a);
  function keyframes() {
    const [A, G, Pn] = [SX[1], SX[2], SX[3]];
    if (!portrait) return [
      { pos: V(4.3, 3.35, 12.9), tgt: V(-1.55, 1.75, 0), foc: V(.8, 1.9, .3), drift: V(-.7, -.2, -1.3) },
      { pos: V(A + 1.9, 3.05, 8.5), tgt: V(A + .5, 1.65, .2), foc: V(A + .15, 1.85, .5), drift: V(-.55, -.12, -.9) },
      { pos: V(G - .9, 3.25, 8.3), tgt: V(G + .75, 1.65, .2), foc: V(G + .15, 1.85, .5), drift: V(.55, -.12, -.9) },
      { pos: V(Pn + 1.6, 2.85, 8.6), tgt: V(Pn + .52, 1.7, .2), foc: V(Pn + .15, 1.85, .5), drift: V(-.45, .1, -.9) },
      { pos: V(T - 1.0, 12.5, 4.3), tgt: V(T - 1.0, 0, .3), foc: V(T + 1.9, .3, 0), drift: V(.35, -.9, -.2) },
    ];
    return [
      { pos: V(1.6, 3.9, 18.5), tgt: V(.8, .15, 0), foc: V(.8, 1.9, .3), drift: V(-.3, -.2, -1.2) },
      { pos: V(A + .8, 2.9, 13.4), tgt: V(A + .12, .2, .2), foc: V(A + .15, 1.85, .5), drift: V(-.3, -.1, -.9) },
      { pos: V(G - .8, 3.1, 13.4), tgt: V(G + .12, .2, .2), foc: V(G + .15, 1.85, .5), drift: V(.3, -.1, -.9) },
      { pos: V(Pn + .6, 2.8, 13.6), tgt: V(Pn + .12, .25, .2), foc: V(Pn + .15, 1.85, .5), drift: V(-.3, .1, -.9) },
      { pos: V(T + 1.5, 15.5, 7.8), tgt: V(T + 1.5, 0, 2.6), foc: V(T + 1.9, .3, 0), drift: V(.2, -.9, -.2) },
    ];
  }
  let KF = keyframes();
  const cam = { pos: V(), tgt: V(), foc: V() };
  const va = V(), vb = V();
  function camAt(p) {
    for (let i = 0; i < HOLDS.length; i++) {
      const [a, b] = HOLDS[i];
      if (p <= b || i === HOLDS.length - 1) {
        if (p >= a) {
          const lt = (clamp01((p - a) / (b - a)) - .5) * (reduce ? 0 : 1);
          cam.pos.copy(KF[i].pos).addScaledVector(KF[i].drift, lt); cam.tgt.copy(KF[i].tgt); cam.foc.copy(KF[i].foc);
        } else {
          const e0 = HOLDS[i - 1][1], t = easeIO(clamp01((p - e0) / (a - e0)));
          va.copy(KF[i - 1].pos).addScaledVector(KF[i - 1].drift, reduce ? 0 : .5);
          vb.copy(KF[i].pos).addScaledVector(KF[i].drift, reduce ? 0 : -.5);
          cam.pos.lerpVectors(va, vb, t);
          const arc = Math.sin(Math.PI * t);
          cam.pos.y += arc * (i === 4 ? 1.5 : .9); cam.pos.z += arc * (i === 4 ? 1.2 : 3.2);
          cam.tgt.lerpVectors(KF[i - 1].tgt, KF[i].tgt, t); cam.foc.lerpVectors(KF[i - 1].foc, KF[i].foc, t);
        }
        return cam;
      }
    }
    return cam;
  }
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr); composer.setSize(w, h);
    camera.aspect = w / h; portrait = camera.aspect < .86;
    camera.fov = portrait ? 34 : 30; camera.updateProjectionMatrix();
    KF = keyframes(); finish.uniforms.uRes.value.set(w * dpr, h * dpr);
  }
  resize(); addEventListener('resize', resize);

  /* ---------- interação ---------- */
  const clock = new THREE.Clock();
  const kick = (g, a = 1) => { g.userData.kickT = clock.elapsedTime; g.userData.kickA = a; };
  function kickSet(f) { gummies.filter(g => g.userData.set === f).forEach((g, k) => setTimeout(() => kick(g, .7), k * 140)); }
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(pickables, true)[0];
  }
  const packAnim = { sq: 0, hop: 0, shake: 0 };
  function hopPack(a = 1) {
    gsap.killTweensOf(packAnim);
    track(gsap.timeline()).to(packAnim, { hop: .35 * a, sq: -.06 * a, duration: .2, ease: 'power2.out' }).to(packAnim, { hop: 0, duration: .55, ease: 'bounce.out' })
      .to(packAnim, { sq: .08 * a, duration: .08 }, '-=.45').to(packAnim, { sq: 0, duration: .7, ease: 'elastic.out(1,.35)' });
  }
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button')) return;
    const hit = pick(e); if (!hit) return;
    if (heroPack.getObjectById(hit.object.id) || trioPack.getObjectById(hit.object.id)) { hopPack(1); packAnim.shake = 1; burst(hit.point, 24); return; }
    kick(hit.object, 1.25); burst(hit.point);
  });
  let hoverT = 0, hovered = null;
  stage.addEventListener('pointermove', e => {
    if (!fine || performance.now() - hoverT < 50) return; hoverT = performance.now();
    const hit = e.target.closest('a,button') ? null : pick(e);
    const g = hit && gummies.includes(hit.object) ? hit.object : null;
    if (g && g !== hovered) kick(g, .35);
    hovered = g; stage.style.cursor = hit ? 'pointer' : '';
  });

  // selo "Qual cai hoje?"
  let selIdx = -1;
  const out = $('#tz-drop-out');
  $('#tz-drop').addEventListener('click', () => {
    let i; do { i = Math.floor(Math.random() * 6); } while (i === selIdx);
    if (selIdx >= 0) gsap.to(trioGums[selIdx].userData, { sel: 0, duration: .7, ease: 'power3.inOut', overwrite: true });
    selIdx = i; hopPack(.8);
    const g = trioGums[i], fl = FLV[g.userData.f];
    const text = (g.userData.shape === 'heart' ? 'Coração de ' : 'Boca de ') + fl.name;
    track(gsap.to(g.userData, { sel: 1, duration: reduce ? .01 : 1.2, delay: reduce ? 0 : .15, ease: 'expo.out', overwrite: true, onComplete: () => { kick(g, .5); } }));
    out.textContent = text + '.';
  });

  /* ---------- loop ---------- */
  let visible = true;
  const observer=new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { rootMargin: '200px' });observer.observe(stageWrap);cleanups.push(()=>observer.disconnect());
  const mouse = { x: 0, y: 0 };
  const hemiC = new THREE.Color();
  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), eTmp = new THREE.Euler(0, 0, 0, 'YXZ');
  const focusPt = V(), pTop = V(), pBot = V();
  let frames = 0, slowAcc = 0, degraded = !fine, landed = false;
  // Publish the real projected slot on the first frame; the hero uses its DOM fallback until then.

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    if(document.hidden)return;
    P = reduce ? targetP : P + (targetP - P) * (1 - Math.exp(-dt * 6));
    updateDOM(P);

    mouse.x = lerp(mouse.x, reduce ? 0 : pointer.nx, .045);
    mouse.y = lerp(mouse.y, reduce ? 0 : pointer.ny, .045);
    const c = camAt(P);
    camera.position.copy(c.pos);
    camera.position.x += mouse.x * .32; camera.position.y += mouse.y * .2 + (reduce ? 0 : Math.sin(t * .35) * .04);
    camera.lookAt(c.tgt);
    camera.updateMatrixWorld();

    // entrega do hero: onde a embalagem vai pousar, em pixels da tela
    const sr = stage.getBoundingClientRect();
    const e = clamp01(1 - sr.top / innerHeight);
    pTop.set(LAND.x, LAND.y + PH / 2, LAND.z).project(camera);
    pBot.set(LAND.x, LAND.y - PH / 2, LAND.z).project(camera);
    const yT = sr.top + (-pTop.y * .5 + .5) * sr.height, yB = sr.top + (-pBot.y * .5 + .5) * sr.height;
    window.__tzSlot = { e, x: sr.left + ((pTop.x+pBot.x) * .25 + .5) * sr.width, y: (yT + yB) / 2, h: yB - yT, pitch:Math.atan2(camera.position.y-LAND.y,Math.hypot(camera.position.x-LAND.x,camera.position.z-LAND.z)) };
    const handed = e >= .985 || document.querySelector('[data-tz-hero]')?.dataset.mode==='static';
    if (handed && !landed) { landed = true; }
    if (e < .9) landed = false;

    if (!visible) return;

    // embalagem em pé: sempre de frente para a câmera
    heroPack.visible = handed;stageWrap.dataset.glReady='true';stage.querySelector('.tz-landing-poster')?.setAttribute('hidden','');
    heroPack.rotation.set(0, Math.atan2(camera.position.x - LAND.x, camera.position.z - LAND.z) + (reduce ? 0 : Math.sin(t * .5) * .012)*smooth(.04,.10,P), Math.sin(t * 40) * .04 * packAnim.shake);
    heroPack.position.set(LAND.x, LAND.y + packAnim.hop + (packAnim.sq * PH / 2), LAND.z);
    heroPack.scale.set(1 - packAnim.sq * .5, 1 + packAnim.sq, 1);
    trioPack.rotation.z = Math.sin(t * 40) * .03 * packAnim.shake;
    packAnim.shake *= Math.exp(-dt * 3);

    spot.position.set(c.tgt.x - 3.6 + mouse.x * 3, 10 + mouse.y * 1.6, 8.6);
    spot.target.position.set(c.foc.x, .6, -.6);
    hemi.groundColor.copy(wallColorAt(c.tgt.x, hemiC));

    for (const g of gummies) {
      const u = g.userData, b = u.base;
      g.position.copy(b.pos); g.rotation.copy(b.rot);
      let s = b.s;
      if (!reduce) {
        if (u.mode === 'float') { g.position.y += Math.sin(t * .9 + u.seed) * .12; g.rotation.y += t * .22; g.rotation.x += Math.sin(t * .5 + u.seed) * .15; }
        if (u.mode === 'hero') { g.position.y += Math.sin(t * 1.0 + u.seed) * .07; g.rotation.y += Math.sin(t * .45 + u.seed) * .38; g.rotation.x += Math.sin(t * .6 + u.seed) * .06; }
      }
      if (u.mode === 'hero') g.rotation.y += (P - ACT_P[u.set + 1]) * 3.2;
      if (u.sel > 0) {
        const k = clamp01(u.sel);
        g.position.y = lerp(b.pos.y, 2.7, k) + Math.sin(k * Math.PI) * .6;
        g.position.z = lerp(b.pos.z, b.pos.z + .9, k);
        qa.setFromEuler(g.rotation); eTmp.set(H + .55, reduce ? 0 : t * .7, 0); qb.setFromEuler(eTmp);
        g.quaternion.copy(qa.slerp(qb, k)); s = lerp(s, 1.0, k);
      }
      if (u.sprite) drawSprite(g);
      const dk = t - u.kickT;
      const sq = reduce ? 0 : u.kickA * .2 * Math.exp(-4.5 * dk) * Math.cos(17 * dk);
      g.scale.set(s * (1 + sq * .5), s * (1 - sq), s * (1 + sq * .5));
      const mu = g.material.userData.u;
      if (!mu) continue;
      mu.uTime.value = t;
      mu.uAmp.value = reduce ? 0 : u.kickA * .042 * Math.exp(-3 * dk) + .004 * (1 + Math.sin(t * 1.3 + u.seed));
    }
    if (!reduce) for (const b of beads) b.position.y = b.userData.y + (b.userData.y > .5 ? Math.sin(t * .8 + b.userData.seed) * .1 : 0);
    for (const cl of cloudPlanes) {
      const u = cl.userData;
      cl.position.x = u.base.x + (reduce ? 0 : Math.sin(t * .12 + u.seed) * .5);
      cl.position.y = u.base.y + (reduce ? 0 : Math.sin(t * .3 + u.seed) * .12);
      if (u.bill) cl.quaternion.copy(camera.quaternion);
    }

    for (let i = 0; i < NP; i++) {
      if (pLife[i] <= 0) continue;
      pLife[i] -= dt * 1.1; pVel[i * 3 + 1] -= 9.8 * dt;
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      if (pLife[i] <= 0) pPos[i * 3 + 1] = -999;
    }
    pGeo.attributes.position.needsUpdate = true;

    focusPt.copy(c.foc);
    // a embalagem é o assunto na aterrissagem e no trio: o foco vai para ela, para ficar nítida como no render
    focusPt.lerp(heroPack.position, (1 - smooth(.06, .14, P)) * (heroPack.visible ? 1 : 0));
    if (selIdx < 0) focusPt.lerp(trioPack.position, smooth(.84, .9, P) * .85);
    if (selIdx >= 0) focusPt.lerp(trioGums[selIdx].position, trioGums[selIdx].userData.sel * smooth(.84, .9, P));
    bokeh.uniforms.focus.value = camera.position.distanceTo(focusPt);
    finish.uniforms.uTime.value = t;
    composer.render(dt);
    renderPlate(t);

    if (!degraded && ++frames > 30) {
      slowAcc = lerp(slowAcc, dt, .05);
      if (frames > 150 && slowAcc > .034) { degraded = true; bokeh.enabled = false; bloom.enabled = false; dpr = 1; resize(); }
    }
  }

  renderer.compile(scene, camera);
  setPct(100); await nextFrame();
  requestAnimationFrame(frame);
  const loader = $('.tz-loader');
  if (reduce) loader.remove();
  else gsap.to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut', delay: .1, onComplete: () => loader.remove() });
  return { kickSet };
}
}
