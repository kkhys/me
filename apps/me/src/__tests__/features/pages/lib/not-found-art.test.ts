import { describe, expect, it } from "vitest";
import {
  addRipple,
  clampDpr,
  computeCanvasSize,
  FLOATS_PER_RIPPLE,
  FRAGMENT_SHADER_SOURCE,
  MAX_DPR,
  packRipples,
  pruneRipples,
  type Ripple,
  RIPPLE_LIFETIME,
  RIPPLE_SLOTS,
  VERTEX_SHADER_SOURCE,
} from "#/features/pages/lib/not-found-art";

const ripple = (born: number): Ripple => ({ x: 0.5, y: 0.5, born, strength: 1 });

describe("clampDpr", () => {
  it("passes through values within range", () => {
    expect(clampDpr(1.5)).toBe(1.5);
  });

  it("caps high-density displays at MAX_DPR", () => {
    expect(clampDpr(3)).toBe(MAX_DPR);
    expect(clampDpr(4)).toBe(MAX_DPR);
  });

  it("raises sub-1 values to 1", () => {
    expect(clampDpr(0.5)).toBe(1);
  });

  it("respects a custom maximum", () => {
    expect(clampDpr(3, 3)).toBe(3);
  });
});

describe("computeCanvasSize", () => {
  it("scales CSS size by the clamped device pixel ratio", () => {
    expect(computeCanvasSize(672, 378, 2)).toEqual({ width: 1344, height: 756 });
  });

  it("clamps the ratio before scaling", () => {
    expect(computeCanvasSize(672, 378, 3)).toEqual({ width: 1344, height: 756 });
  });

  it("rounds fractional pixel sizes", () => {
    expect(computeCanvasSize(100.4, 56.5, 1)).toEqual({ width: 100, height: 57 });
  });

  it("never returns a dimension below 1", () => {
    expect(computeCanvasSize(0, 0, 1)).toEqual({ width: 1, height: 1 });
  });
});

describe("addRipple", () => {
  it("appends new ripples", () => {
    const ripples = addRipple([], ripple(1));
    expect(ripples.length).toBe(1);
  });

  it("does not mutate the input", () => {
    const initial = [ripple(1)];
    addRipple(initial, ripple(2));
    expect(initial.length).toBe(1);
  });

  it("caps the total at the slot count, dropping the oldest", () => {
    let ripples: Ripple[] = [];
    for (let i = 1; i <= RIPPLE_SLOTS + 3; i++) {
      ripples = addRipple(ripples, ripple(i));
    }
    expect(ripples.length).toBe(RIPPLE_SLOTS);
    expect(Math.min(...ripples.map((r) => r.born))).toBe(4);
  });
});

describe("pruneRipples", () => {
  it("keeps ripples that are still fading", () => {
    expect(pruneRipples([ripple(10)], 10 + RIPPLE_LIFETIME - 0.1).length).toBe(1);
  });

  it("drops ripples past their lifetime", () => {
    expect(pruneRipples([ripple(10)], 10 + RIPPLE_LIFETIME).length).toBe(0);
  });
});

describe("packRipples", () => {
  it("packs ripples into vec4 slots with their strength", () => {
    const out = new Float32Array(RIPPLE_SLOTS * FLOATS_PER_RIPPLE);
    packRipples([{ x: 0.5, y: 0.25, born: 2, strength: 0.35 }], out);
    expect(out[0]).toBeCloseTo(0.5);
    expect(out[1]).toBeCloseTo(0.25);
    expect(out[2]).toBeCloseTo(2);
    expect(out[3]).toBeCloseTo(0.35);
    for (let i = FLOATS_PER_RIPPLE; i < out.length; i++) {
      expect(out[i]).toBe(0);
    }
  });

  it("clears slots left over from a previous pack", () => {
    const out = new Float32Array(RIPPLE_SLOTS * FLOATS_PER_RIPPLE).fill(9);
    packRipples([], out);
    expect([...out].every((v) => v === 0)).toBe(true);
  });
});

describe("shader sources", () => {
  it("declares the attributes and uniforms the component binds", () => {
    expect(VERTEX_SHADER_SOURCE).toContain("a_position");
    for (const name of [
      "u_resolution",
      "u_time",
      "u_pointer",
      "u_pointerStrength",
      "u_pointerVel",
      "u_grip",
      "u_glyphs",
      "u_lineColor",
      "u_lineAlpha",
    ]) {
      expect(FRAGMENT_SHADER_SOURCE).toContain(name);
    }
    expect(FRAGMENT_SHADER_SOURCE).toContain(`u_ripples[${RIPPLE_SLOTS}]`);
  });
});
