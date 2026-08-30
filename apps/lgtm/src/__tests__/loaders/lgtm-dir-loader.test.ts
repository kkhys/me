import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DESCRIPTION_FILE, readDescription } from "#/loaders/lgtm-dir-loader";

let entryDir: string;

beforeEach(() => {
  entryDir = mkdtempSync(join(tmpdir(), "lgtm-entry-"));
});

afterEach(() => {
  rmSync(entryDir, { recursive: true, force: true });
});

describe("readDescription", () => {
  it("returns the trimmed description", async () => {
    writeFileSync(join(entryDir, DESCRIPTION_FILE), "a cat asleep on a keyboard\n", "utf-8");
    await expect(readDescription(entryDir)).resolves.toBe("a cat asleep on a keyboard");
  });

  it("rejects an entry without the file", async () => {
    await expect(readDescription(entryDir)).rejects.toThrow(`Missing ${DESCRIPTION_FILE}`);
  });

  it("rejects a blank description", async () => {
    writeFileSync(join(entryDir, DESCRIPTION_FILE), " \n", "utf-8");
    await expect(readDescription(entryDir)).rejects.toThrow(`Empty ${DESCRIPTION_FILE}`);
  });
});
