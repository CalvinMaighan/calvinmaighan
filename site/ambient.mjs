/**
 * Coalesce-inspired ambient field for the hero.
 * Attracts / spirals toward POINTER from active-state.
 * Palette: black · beige · green (mode-tuned).
 */

const { PI, cos, sin, abs, atan2, random, min, max } = Math;
const HALF_PI = 0.5 * PI;

const PARTICLE_COUNT = 300;
const PROP_COUNT = 9; // x y vx vy life ttl speed size kind
const PROPS_LENGTH = PARTICLE_COUNT * PROP_COUNT;

const KIND_BLACK = 0;
const KIND_BEIGE = 1;
const KIND_GREEN = 2;

const BASE_TTL = 90;
const RANGE_TTL = 280;
const BASE_SPEED = 0.12;
const RANGE_SPEED = 0.85;
const BASE_SIZE = 2;
const RANGE_SIZE = 8;

/** Rest focus: right of center, slightly above midline */
const REST_NX = 0.68;
const REST_NY = 0.42;
const ORBIT_RADIUS = 38;
/** Motion at tempo = 1 matches former 0.25 slider feel */
const SPEED_SCALE = 0.12 * (0.25 / 0.8);
const REF_TEMPO = 1;
const TANG_SPEED = 1.05;
const RADIAL_SPRING = 0.1;
const STEER = 0.045;
const ATTRACT_EASE = 0.06;

const rand = (n) => n * random();
const lerp = (a, b, t) => a + (b - a) * t;
const fadeInOut = (t, m) => {
  const hm = 0.5 * m;
  return abs((t + hm) % m - hm) / hm;
};
const angleTo = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const hypot = (dx, dy) => Math.hypot(dx, dy);

function pickKind(dark) {
  const r = random();
  if (dark) {
    // Dark: soft neutral majority, sparse desaturated green
    if (r < 0.7) return KIND_BEIGE;
    if (r < 0.9) return KIND_BLACK;
    return KIND_GREEN;
  }
  // Light: grey + paper beige majority, green as accent
  if (r < 0.34) return KIND_BLACK;
  if (r < 0.78) return KIND_BEIGE;
  return KIND_GREEN;
}

function strokeFor(kind, alpha, dark) {
  if (dark) {
    if (kind === KIND_GREEN) return `hsla(145, 28%, 55%, ${alpha * 0.45})`;
    if (kind === KIND_BLACK) return `oklch(72% 0.016 250 / ${alpha * 0.7})`; // slate
    return `oklch(70% 0.02 250 / ${alpha})`; // secondary slate mist
  }
  // Light: soft grey + warm beige (#F3DDC2 / oklch 90.9% 0.043 73) + CTA green
  if (kind === KIND_GREEN) return `hsla(145, 68%, 38%, ${alpha})`;
  if (kind === KIND_BLACK) return `oklch(74% 0.018 250 / ${alpha})`; // slate grey
  return `oklch(87.5% 0.055 73 / ${alpha})`;
}

/**
 * @param {{
 *   canvas: HTMLCanvasElement,
 *   getPointer: () => { x: number, y: number, active: boolean },
 *   getTempo: () => number,
 *   getDark: () => boolean,
 * }} opts
 */
export function startAmbient({ canvas, getPointer, getTempo, getDark }) {
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const hero = document.querySelector(".hero");
  const header = document.getElementById("site-header");
  if (!hero) return () => {};

  const off = document.createElement("canvas");
  const ctxOff = off.getContext("2d", { alpha: true });
  const ctxOn = canvas.getContext("2d", { alpha: true });
  if (!ctxOff || !ctxOn) return () => {};

  const props = new Float32Array(PROPS_LENGTH);
  let w = 0;
  let h = 0;
  let headerH = 0;
  let dpr = 1;
  let raf = 0;
  let running = true;
  let wasDark = getDark();

  let ax = 0;
  let ay = 0;
  let targetAx = 0;
  let targetAy = 0;
  let rate = 1;
  const orbitRadius = ORBIT_RADIUS;

  function restY() {
    return headerH + (h - headerH) * REST_NY;
  }

  function syncRate() {
    const tempo = Number(getTempo?.() ?? REF_TEMPO);
    rate = max(0.05, tempo) / REF_TEMPO; // 1 = baseline; 0.25–4×
  }

  function resize() {
    headerH = header?.offsetHeight || 64;
    const heroH = hero.offsetHeight || 1;
    dpr = min(window.devicePixelRatio || 1, 2);
    w = max(1, Math.floor(window.innerWidth));
    h = max(1, Math.floor(headerH + heroH));
    const pw = Math.floor(w * dpr);
    const ph = Math.floor(h * dpr);

    canvas.width = pw;
    canvas.height = ph;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    off.width = pw;
    off.height = ph;

    ctxOn.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxOff.setTransform(dpr, 0, 0, dpr, 0, 0);

    targetAx = ax = w * REST_NX;
    targetAy = ay = restY();
  }

  function initParticle(i, dark) {
    // Spawn outside the orbit ring around the current attractor
    const ang = rand(PI * 2);
    const r = orbitRadius + 28 + rand(min(w, h) * 0.42);
    const x = ax + cos(ang) * r;
    const y = ay + sin(ang) * r;

    const theta = angleTo(x, y, ax, ay);
    const rush = 4 + rand(4);
    const vx = cos(theta) * rush;
    const vy = sin(theta) * rush;
    const life = 0;
    const ttl = BASE_TTL + rand(RANGE_TTL);
    const speed = BASE_SPEED + rand(RANGE_SPEED);
    const size = BASE_SIZE + rand(RANGE_SIZE);
    const kind = pickKind(dark);

    props.set([x, y, vx, vy, life, ttl, speed, size, kind], i);
  }

  function initAll(dark) {
    for (let i = 0; i < PROPS_LENGTH; i += PROP_COUNT) initParticle(i, dark);
  }

  function drawParticle(x, y, theta, life, ttl, size, kind, dark) {
    const alpha = fadeInOut(life, ttl) * (dark ? 0.5 : 0.72);
    const xRel = x - size * 0.5;
    const yRel = y - size * 0.5;
    const color = strokeFor(kind, alpha, dark);

    ctxOff.save();
    ctxOff.lineCap = "round";
    ctxOff.lineWidth = dark ? 1 : kind === KIND_GREEN ? 1.35 : 1.15;
    ctxOff.strokeStyle = color;
    ctxOff.translate(x, y);
    ctxOff.rotate(theta);
    ctxOff.translate(-x, -y);
    // Soft filled beige chips so the field reads less green-on-neutral
    if (!dark && kind === KIND_BEIGE) {
      ctxOff.fillStyle = strokeFor(kind, alpha * 0.55, dark);
      ctxOff.fillRect(xRel, yRel, size, size);
    }
    ctxOff.strokeRect(xRel, yRel, size, size);
    ctxOff.restore();
  }

  function updateParticle(i, dark) {
    const i2 = i + 1;
    const i3 = i + 2;
    const i4 = i + 3;
    const i5 = i + 4;
    const i6 = i + 5;
    const i7 = i + 6;
    const i8 = i + 7;
    const i9 = i + 8;

    const x = props[i];
    const y = props[i2];
    const dx = x - ax;
    const dy = y - ay;
    const dist = hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    // Tangent orbit + soft spring to keep the circle tight
    const tx = -ny;
    const ty = nx;
    const radial = (dist - orbitRadius) * RADIAL_SPRING;
    const steer = min(1, STEER * rate);
    const vx = lerp(props[i3], tx * TANG_SPEED - nx * radial, steer);
    const vy = lerp(props[i4], ty * TANG_SPEED - ny * radial, steer);
    let life = props[i5];
    const ttl = props[i6];
    const speed = props[i7];
    const size = props[i8];
    const kind = props[i9];
    const theta = angleTo(x, y, ax, ay) + HALF_PI;

    // Motion × rate; life ages by rate → same paths, spawn/duration scale with speed
    const x2 = x + vx * speed * SPEED_SCALE * rate;
    const y2 = y + vy * speed * SPEED_SCALE * rate;

    drawParticle(x, y, theta, life, ttl, size, kind, dark);

    life += rate;
    props[i] = x2;
    props[i2] = y2;
    props[i3] = vx;
    props[i4] = vy;
    props[i5] = life;

    if (life > ttl) initParticle(i, dark);
  }

  function renderGlow(dark) {
    if (dark) {
      // Soft bloom only — avoid bright additive green wash
      ctxOn.save();
      ctxOn.filter = "blur(8px)";
      ctxOn.globalCompositeOperation = "source-over";
      ctxOn.globalAlpha = 0.35;
      ctxOn.drawImage(off, 0, 0, w, h);
      ctxOn.restore();

      ctxOn.save();
      ctxOn.filter = "blur(2px)";
      ctxOn.globalCompositeOperation = "lighter";
      ctxOn.globalAlpha = 0.45;
      ctxOn.drawImage(off, 0, 0, w, h);
      ctxOn.restore();

      ctxOn.save();
      ctxOn.globalCompositeOperation = "source-over";
      ctxOn.globalAlpha = 0.95;
      ctxOn.drawImage(off, 0, 0, w, h);
      ctxOn.restore();
      return;
    }

    // Light: soft ink bloom (no additive wash that muddies beige)
    ctxOn.save();
    ctxOn.filter = "blur(6px)";
    ctxOn.globalCompositeOperation = "source-over";
    ctxOn.globalAlpha = 0.28;
    ctxOn.drawImage(off, 0, 0, w, h);
    ctxOn.restore();

    ctxOn.save();
    ctxOn.filter = "blur(2px)";
    ctxOn.globalCompositeOperation = "source-over";
    ctxOn.globalAlpha = 0.45;
    ctxOn.drawImage(off, 0, 0, w, h);
    ctxOn.restore();

    ctxOn.save();
    ctxOn.globalCompositeOperation = "source-over";
    ctxOn.globalAlpha = 1;
    ctxOn.drawImage(off, 0, 0, w, h);
    ctxOn.restore();
  }

  function syncPointer() {
    const p = getPointer();
    if (p?.active) {
      targetAx = min(1, max(0, p.x)) * w;
      targetAy = min(1, max(0, p.y)) * h;
    } else {
      targetAx = REST_NX * w;
      targetAy = restY();
    }

    const ease = min(1, ATTRACT_EASE * rate);
    ax = lerp(ax, targetAx, ease);
    ay = lerp(ay, targetAy, ease);
  }

  function frame() {
    if (!running) return;

    const dark = getDark();
    if (dark !== wasDark) {
      wasDark = dark;
      initAll(dark);
      ctxOn.clearRect(0, 0, w, h);
    }

    syncRate();
    syncPointer();
    ctxOff.clearRect(0, 0, w, h);
    ctxOn.clearRect(0, 0, w, h);

    for (let i = 0; i < PROPS_LENGTH; i += PROP_COUNT) {
      updateParticle(i, dark);
    }

    renderGlow(dark);
    raf = requestAnimationFrame(frame);
  }

  resize();
  initAll(wasDark);
  ctxOn.clearRect(0, 0, w, h);
  raf = requestAnimationFrame(frame);

  const ro = new ResizeObserver(() => {
    resize();
  });
  ro.observe(hero);
  if (header) ro.observe(header);
  window.addEventListener("resize", resize);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("resize", resize);
  };
}
