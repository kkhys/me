/**
 * Inline handlers that clear the blurred placeholder wrapping an image.
 *
 * `error` matters as much as `load`: an image that never decodes (blocked
 * mixed content, 404, unsupported format) would otherwise leave the blur on
 * screen forever. Inline attributes rather than a script so the reveal also
 * works for images that finish before any bundle is parsed.
 *
 * @param selector CSS selector of the ancestor carrying the blur.
 */
export const blurLoadHandlers = (selector: string) => {
  const reveal = `this.closest('${selector}')?.classList.add('image-loaded')`;
  return { onload: reveal, onerror: reveal };
};
