import { describe, expect, it } from "vitest";
import { cycleIndex, isToggleShortcut, type ShortcutKeyEvent } from "../keyboard";

const key = (overrides: Partial<ShortcutKeyEvent>): ShortcutKeyEvent => ({
  key: "k",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  ...overrides,
});

describe("isToggleShortcut", () => {
  it("accepts Cmd+K and Ctrl+K regardless of letter case", () => {
    expect(isToggleShortcut(key({ metaKey: true }))).toBe(true);
    expect(isToggleShortcut(key({ ctrlKey: true }))).toBe(true);
    expect(isToggleShortcut(key({ ctrlKey: true, key: "K" }))).toBe(true);
  });

  it("rejects a bare K and any Alt combination", () => {
    expect(isToggleShortcut(key({}))).toBe(false);
    expect(isToggleShortcut(key({ ctrlKey: true, altKey: true }))).toBe(false);
  });

  it("rejects other keys with the modifier", () => {
    expect(isToggleShortcut(key({ metaKey: true, key: "j" }))).toBe(false);
  });
});

describe("cycleIndex", () => {
  it("wraps from the last item back to the first", () => {
    expect(cycleIndex(3, 1, 4)).toBe(0);
  });

  it("wraps from the first item back to the last", () => {
    expect(cycleIndex(0, -1, 4)).toBe(3);
  });

  it("steps within the list", () => {
    expect(cycleIndex(1, 1, 4)).toBe(2);
    expect(cycleIndex(2, -1, 4)).toBe(1);
  });

  it("stays put with a single item", () => {
    expect(cycleIndex(0, 1, 1)).toBe(0);
    expect(cycleIndex(0, -1, 1)).toBe(0);
  });

  it("returns undefined when nothing in the list is focused", () => {
    expect(cycleIndex(-1, 1, 4)).toBeUndefined();
    expect(cycleIndex(0, 1, 0)).toBeUndefined();
  });
});
