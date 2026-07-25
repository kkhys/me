/**
 * Pure helpers for the 404 page WebGL artwork: a still-water surface of
 * flowing horizontal lines. The pointer parts the lines as it hovers and a
 * click sends a widening ripple through them. Everything is drawn as line
 * displacement; there are no circular shapes. Ripple bookkeeping lives here
 * as pure functions so it is unit-testable; the .astro script only owns the
 * GL plumbing.
 */

/** Cap the device pixel ratio so 4x displays don't quadruple the fill cost. */
export const MAX_DPR = 2;

export const clampDpr = (dpr: number, max: number = MAX_DPR): number =>
  Math.min(Math.max(dpr, 1), max);

export const computeCanvasSize = (
  cssWidth: number,
  cssHeight: number,
  dpr: number,
): { width: number; height: number } => {
  const scale = clampDpr(dpr);
  return {
    width: Math.max(1, Math.round(cssWidth * scale)),
    height: Math.max(1, Math.round(cssHeight * scale)),
  };
};

/** World space: x in [0, ASPECT], y in [0, 1], isotropic on a 16:9 canvas. */
export const ASPECT = 16 / 9;

/** The shader tracks a fixed number of ripple slots. */
export const RIPPLE_SLOTS = 12;

/** Seconds until a ripple has fully faded (amplitude decays exponentially). */
export const RIPPLE_LIFETIME = 4;

/** Packed ripple layout: x, y, bornTime, strength. */
export const FLOATS_PER_RIPPLE = 4;

export interface Ripple {
  x: number;
  y: number;
  born: number;
  /** Relative amplitude: clicks are strong, pointer-trail wakes are soft. */
  strength: number;
}

/**
 * Register a click ripple. The surface keeps at most RIPPLE_SLOTS of them;
 * beyond that the oldest is dropped. Returns a new array.
 */
export const addRipple = (ripples: readonly Ripple[], ripple: Ripple): Ripple[] => {
  const next = [...ripples, ripple];
  while (next.length > RIPPLE_SLOTS) {
    const oldest = next.reduce((a, b) => (a.born <= b.born ? a : b));
    next.splice(next.indexOf(oldest), 1);
  }
  return next;
};

/** Drop ripples that have fully faded. */
export const pruneRipples = (ripples: readonly Ripple[], time: number): Ripple[] =>
  ripples.filter((r) => time < r.born + RIPPLE_LIFETIME);

/** Pack ripples into vec4 slots for the shader; unused slots stay inactive. */
export const packRipples = (ripples: readonly Ripple[], out: Float32Array): Float32Array => {
  out.fill(0);
  for (let i = 0; i < Math.min(ripples.length, RIPPLE_SLOTS); i++) {
    const ripple = ripples[i];
    if (!ripple) continue;
    out[i * FLOATS_PER_RIPPLE] = ripple.x;
    out[i * FLOATS_PER_RIPPLE + 1] = ripple.y;
    out[i * FLOATS_PER_RIPPLE + 2] = ripple.born;
    out[i * FLOATS_PER_RIPPLE + 3] = ripple.strength;
  }
  return out;
};

export const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_SOURCE = `
#extension GL_OES_standard_derivatives : enable

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform vec2 u_pointerVel;
uniform float u_grip;
uniform vec4 u_ripples[${RIPPLE_SLOTS}];
uniform sampler2D u_glyphs;
uniform vec3 u_lineColor;
uniform float u_lineAlpha;

const float LINE_FREQ = 32.0;

// Smooth sign: -1..1 without the hard step (GLSL ES 1.0 has no tanh).
float softsign(float x) {
  return x / sqrt(1.0 + x * x);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Layered swells: slow currents vary the line density across the
  // surface, so the pattern flows like silk rather than sitting still.
  float drift = u_time * 0.3;
  float phase = p.y
    + 0.014 * sin(p.x * 2.1 + drift * 0.5) * sin(p.y * 2.6 + drift * 0.23 + 1.0)
    + 0.007 * sin(p.x * 4.7 + p.y * 3.4 - drift * 0.7)
    + 0.004 * sin(p.x * 10.0 + 1.3 + drift * 1.1);

  // A buried "404": the lines swell over the blurred glyphs, and the number
  // emerges purely from how they bend. It breathes, faintly. The second
  // term pulls lines toward the glyph core, so the digits also read as a
  // denser weave.
  float glyph = texture2D(u_glyphs, uv).r;
  phase += glyph * (0.075 + 0.012 * sin(u_time * 0.4));
  phase += glyph * (p.y - 0.5) * 0.45;

  // The pointer parts the lines: above the cursor they lift, below they
  // sink, opening a soft seam that closes when it leaves. While pressed
  // (u_grip -> 1) the seam inverts into a grip: the lines gather into the
  // cursor and stay clenched until release.
  vec2 dp = p - u_pointer;
  float env = exp(-dot(dp, dp) * 12.0) * u_pointerStrength;
  env *= 1.0 + 0.6 * u_grip;
  phase += 0.05 * softsign(dp.y * 9.0) * env * (1.0 - 2.2 * u_grip);
  phase += 0.012 * sin(p.x * 16.0 - u_time * 2.0) * env * (1.0 - u_grip);

  // Motion drag: the fabric follows the pointer's movement and springs
  // back when it stops.
  phase -= u_pointerVel.y * env * 0.10;
  phase += softsign(dp.x * 5.0) * u_pointerVel.x * env * 0.06;

  // Ripples: a click blooms a wide seam that settles back smoothly;
  // pointer-trail wakes leave the same mark, softer.
  for (int i = 0; i < ${RIPPLE_SLOTS}; i++) {
    vec4 r = u_ripples[i];
    float age = u_time - r.z;
    float alive = step(0.0001, r.w) * step(0.0, age);
    float spread = 1.0 + age * 2.4;
    float k = 12.0 / (spread * spread);
    float e = smoothstep(0.0, 0.18, age) * exp(-age * 1.2) * alive * r.w;
    vec2 dr = p - r.xy;
    phase += 0.08 * softsign(dr.y * 9.0) * exp(-dot(dr, dr) * k) * e;
  }

  // Thin flat lines, anti-aliased against the local line density.
  float cell = phase * LINE_FREQ;
  float g = fract(cell);
  float dLine = min(g, 1.0 - g);
#ifdef GL_OES_standard_derivatives
  float grad = max(fwidth(cell), 1e-5);
#else
  float grad = LINE_FREQ / u_resolution.y;
#endif
  float line = 1.0 - smoothstep(0.4, 1.5, dLine / grad);
  // Where the pattern compresses below pixel size, melt it into a flat
  // surface instead of shimmering (moire).
  line *= 1.0 - smoothstep(0.25, 0.5, grad);

  gl_FragColor = vec4(u_lineColor, line * u_lineAlpha);
}
`;
