/**
 * How the droplet moves: in a drag its body hangs on a spring behind the pointer (it trails
 * a move, then wobbles), dropped it splashes: it hits the water, spreads, throws a crown
 * of droplets and a jet up, and sends rings over the water. `compose` puts a moment of
 * that into a `WaterScene` for the shader (px from the canvas center, y up).
 */

import type { Coordinates } from '@vue-dnd-kit/core';
import { ASPECT, DROPS, type WaterScene } from './water';

/** How long a splash plays, in ms: the drop waits for it. */
export const SPLASH = 850;

/** The drop's round end (as in the shader), and the water line under the drop. */
const R = 17;
const WATER = -21;
const GRAVITY = 1600;
/** The crown's droplets; the last slot is the jet's. */
const CROWN = DROPS - 1;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (from: number, to: number, x: number) => {
  const t = clamp01((x - from) / (to - from));
  return t * t * (3 - 2 * t);
};
const easeOut = (x: number) => 1 - (1 - clamp01(x)) ** 3;

/** The drop's body on a spring behind the pointer; `lag` is where it is from it (page px, y down). */
export const createJelly = () => {
  const STIFFNESS = 260;
  const DAMPING = 12;
  const STEP = 1 / 120;
  const lag = { x: 0, y: 0 };
  const speed = { x: 0, y: 0 };
  let last: Coordinates | null = null;
  return {
    lag: lag as Readonly<Coordinates>,
    step(pointer: Readonly<Coordinates> | null, dt: number) {
      // The pointer takes the box along at once; the body stays behind and catches up.
      if (pointer && last) {
        lag.x -= pointer.x - last.x;
        lag.y -= pointer.y - last.y;
      }
      if (pointer) last = { x: pointer.x, y: pointer.y };
      for (let left = dt; left > 0; left -= STEP) {
        const h = Math.min(STEP, left);
        speed.x += (-STIFFNESS * lag.x - DAMPING * speed.x) * h;
        speed.y += (-STIFFNESS * lag.y - DAMPING * speed.y) * h;
        lag.x += speed.x * h;
        lag.y += speed.y * h;
      }
    },
  };
};

/** One splash's own throw: the crown's droplets, at random. */
export interface Splash {
  crown: Array<{ angle: number; out: number; up: number; size: number; at: number }>;
}

export const createSplash = (): Splash => ({
  crown: Array.from({ length: CROWN }, (_, index) => ({
    angle: ((index + Math.random() * 0.7) / CROWN) * Math.PI * 2,
    out: 90 + Math.random() * 80,
    up: 240 + Math.random() * 150,
    size: 2 + Math.random() * 2.6,
    at: 0.03 + Math.random() * 0.04,
  })),
});

export interface Moment {
  /** Seconds since the droplet formed. */
  age: number;
  /** The body's lag behind the pointer (`createJelly`). */
  lag: Readonly<Coordinates>;
  /** The splash and how far into it, in seconds; `null` before the drop. */
  splash: { throw: Splash; time: number } | null;
  /** Reduced motion: no pop, no crown nor jet. */
  calm: boolean;
}

type Matrix = [number, number, number, number];
/** 2×2, row-major. */
const multiply = ([a, b, c, d]: Matrix, [e, f, g, h]: Matrix): Matrix => [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h];

const setRipple = (scene: WaterScene, index: number, x: number, y: number, radius: number, strength: number) =>
  scene.ripples.set([x, y, radius, Math.max(0, strength)], index * 4);

export const compose = (scene: WaterScene, { age, lag, splash, calm }: Moment): void => {
  const t = splash ? splash.time : -1;
  const form = calm ? 1 : 1 - 0.65 * Math.exp(-age * 10) * Math.cos(age * 17);
  const impact = t < 0 ? 0 : easeOut(t / 0.08);
  const held = 1 - impact;

  // The lag, softly limited (y up from here on), let go as the drop hits the water.
  const lx = lag.x;
  const ly = -lag.y;
  const soft = held / (1 + Math.hypot(lx, ly) / 14);
  const vx = lx * soft;
  const vy = ly * soft;
  const pull = Math.hypot(vx, vy);

  // The body: stretched along its lag, its tip trailing the move, squashed on impact.
  const along = 1 + pull * 0.02;
  const across = 1 / Math.sqrt(Math.sqrt(along));
  const [dx, dy] = pull > 1e-4 ? [vx / pull, vy / pull] : [0, 1];
  const k = along - across;
  const stretch: Matrix = [across + k * dx * dx, k * dx * dy, k * dx * dy, across + k * dy * dy];
  const tipX = vx * 0.7;
  const tipY = 14 + vy * 0.7;
  const tip = Math.hypot(tipX, tipY);
  const [ax, ay] = [tipX / tip, tipY / tip];
  const turn: Matrix = [ay, ax, -ax, ay];
  const size = form * (t < 0 ? 1 : 1 - smooth(0.04, 0.26, t));
  const sx = (1 + 0.5 * impact) * size;
  const sy = (1 - 0.55 * impact) * size;
  const [a, b, c, d] = multiply(multiply(stretch, turn), [sx, 0, 0, sy]);
  const det = a * d - b * c;
  if (size > 0.02 && Math.abs(det) > 1e-6) {
    const bob = Math.sin(age * 2.4) * 1.2 * held;
    scene.bodyAt[0] = vx * 0.45;
    scene.bodyAt[1] = WATER + R * sy + vy * 0.45 + bob;
    // Column-major, as GL takes it.
    scene.bodyInverse.set([d / det, -c / det, -b / det, a / det]);
    // The smallest singular value: distances in the shape's space shrink by at least it.
    const sum = a * a + b * b + c * c + d * d;
    scene.bodyScale = Math.sqrt((sum - Math.sqrt(Math.max(0, sum * sum - 4 * det * det))) / 2);
  } else {
    scene.bodyScale = 0;
  }

  // The shadow: off to the side while the drop is held over the water, under it once it hits.
  const shadowAt = 1 - 0.8 * impact;
  scene.shadow.set([7 * shadowAt, -10 * shadowAt, 6 - 3.5 * impact, Math.min(1, form) * (t < 0 ? 1 : 1 - smooth(0.2, 0.6, t))]);

  scene.puddle.fill(0);
  scene.jet.fill(0);
  scene.drops.fill(0);
  scene.ripples.fill(0);
  if (!splash) return;
  const end = SPLASH / 1000;

  // The puddle the drop spreads into, soaking away.
  if (t > 0.02) {
    const grow = easeOut((t - 0.02) / 0.28);
    const soak = smooth(0.32, 0.8, t);
    const rx = (12 + 26 * grow) * (1 - 0.6 * soak);
    const ry = (12 + 26 * grow) * ASPECT * (1 - 0.85 * soak);
    if (ry > 0.4) scene.puddle.set([0, WATER + 1, rx, ry]);
  }

  // Rings: three from the impact, one where each droplet falls back.
  [1, 0.7, 0.45].forEach((strength, index) => {
    const tau = t - 0.03 - 0.11 * index;
    if (tau <= 0) return;
    const fade = clamp01(tau / 0.05) * (1 - smooth(0, end - 0.03 - 0.11 * index, tau));
    setRipple(scene, index, 0, WATER + 1, 14 + 135 * tau - 30 * tau * tau, strength * fade);
  });
  if (calm) return;

  splash.throw.crown.forEach(({ angle, out, up, size: drop, at }, index) => {
    const tau = t - at;
    const flight = (2 * up) / GRAVITY;
    if (tau <= 0) return;
    if (tau < flight) {
      const spread = 13 + out * tau;
      const height = up * tau - (GRAVITY * tau * tau) / 2;
      const x = Math.cos(angle) * spread;
      const y = WATER + 1 + Math.sin(angle) * spread * ASPECT + height;
      scene.drops.set([x, y, drop * (1 - (0.3 * tau) / flight) * clamp01(tau / 0.04)], index * 4);
      return;
    }
    // Fallen back: a small ring where it went in.
    const since = tau - flight;
    const spread = 13 + out * flight;
    const fade = clamp01(since / 0.03) * (1 - smooth(0, 0.35, since));
    setRipple(scene, 3 + index, Math.cos(angle) * spread, WATER + 1 + Math.sin(angle) * spread * ASPECT, 2 + 45 * since, 0.5 * fade);
  });

  // The jet: it rises from the middle, a droplet pinches off its top and falls back in.
  const base = WATER + 1;
  const rise = (t - 0.1) / 0.3;
  if (rise > 0 && rise < 1) scene.jet.set([0, base, 26 * Math.sin(Math.PI * rise) * (rise > 0.5 ? 1 - (rise - 0.5) : 1), 4.5 * (1 - 0.35 * rise)]);
  const off = 0.25;
  const lift = 27.5;
  const top = base + lift;
  const tau = t - off;
  const fall = (70 + Math.sqrt(70 * 70 + 2 * GRAVITY * lift)) / GRAVITY;
  const slot = CROWN * 4;
  if (t > 0.16 && tau < 0) {
    scene.drops.set([0, base + 26 * Math.sin(Math.PI * rise) + 1.5, 3.4 * smooth(0.16, 0.24, t)], slot);
  } else if (tau >= 0 && tau < fall) {
    scene.drops.set([0, top + 70 * tau - (GRAVITY * tau * tau) / 2, 3.4], slot);
  } else if (tau >= fall) {
    const since = tau - fall;
    setRipple(scene, 3 + CROWN, 0, base, 3 + 50 * since, 0.6 * clamp01(since / 0.03) * (1 - smooth(0, 0.35, since)));
  }
};
