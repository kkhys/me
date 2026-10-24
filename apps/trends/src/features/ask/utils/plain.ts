/* Gemini Nano writes Markdown for a summary however the prompt asks for
   plain text, and the answer is rendered through textContent, where `**`
   and `* ` would show as they are. This strips the handful of markers it
   uses into plain text. It runs on the whole answer so far on every frame,
   so it must be idempotent and must cope with a marker cut mid-stream. */

const HEADING = /^[ \t]*#{1,6}[ \t]+/gmu;
const BULLET = /^[ \t]*[*+-][ \t]+/gmu;
const EMPHASIS = /\*\*/gu;
const CODE = /`/gu;
const BLANK_RUN = /\n{3,}/gu;

export const plainText = (markdown: string): string =>
  markdown
    .replaceAll(HEADING, "")
    .replaceAll(BULLET, "・")
    .replaceAll(EMPHASIS, "")
    .replaceAll(CODE, "")
    .replaceAll(BLANK_RUN, "\n\n");
