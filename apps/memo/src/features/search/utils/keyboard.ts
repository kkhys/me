export type ShortcutKeyEvent = Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey">;

export interface EditableCandidate {
  tagName: string;
  isContentEditable: boolean;
}

// Alt is excluded so AltGr combinations on layouts that report ctrlKey for
// AltGr keep producing characters.
export const isToggleShortcut = (event: ShortcutKeyEvent): boolean =>
  (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k";

export const isEditableTarget = (target: EditableCandidate | null): boolean =>
  target !== null &&
  (target.isContentEditable || /^(?:input|textarea|select)$/iu.test(target.tagName));

/** Next index when stepping through `length` items with wrap-around; `undefined` when nothing is focused. */
export const cycleIndex = (current: number, offset: 1 | -1, length: number): number | undefined => {
  if (current < 0 || length <= 0) return undefined;
  return (current + offset + length) % length;
};
