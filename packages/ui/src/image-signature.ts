/**
 * Byte-signature sniffing for image formats, shared by the og:image and
 * favicon validators. Content-type headers can't be trusted (some endpoints
 * advertise `image/png` but serve an HTML challenge page), so callers check
 * the leading bytes instead.
 */

const matchesAt = (bytes: Uint8Array, offset: number, signature: readonly number[]): boolean =>
  signature.every((byte, index) => bytes[offset + index] === byte);

/** Formats Astro's sharp service can actually decode. */
export const isRasterImage = (bytes: Uint8Array): boolean => {
  // PNG
  if (matchesAt(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return true;
  }
  // JPEG
  if (matchesAt(bytes, 0, [0xff, 0xd8, 0xff])) return true;
  // GIF ("GIF8")
  if (matchesAt(bytes, 0, [0x47, 0x49, 0x46, 0x38])) return true;
  // WebP ("RIFF"...."WEBP")
  if (
    matchesAt(bytes, 0, [0x52, 0x49, 0x46, 0x46]) &&
    matchesAt(bytes, 8, [0x57, 0x45, 0x42, 0x50])
  ) {
    return true;
  }
  // AVIF / HEIF (ISOBMFF "ftyp" box)
  if (matchesAt(bytes, 4, [0x66, 0x74, 0x79, 0x70])) return true;
  return false;
};

/** ICO header (reserved 0x0000 + type 0x0001); sharp can't decode these. */
export const isIcoImage = (bytes: Uint8Array): boolean =>
  matchesAt(bytes, 0, [0x00, 0x00, 0x01, 0x00]);

/**
 * An HTML error page can mention "<svg" somewhere in its body, so only accept
 * documents that open with an SVG root or an XML prolog leading to one.
 */
export const isSvgDocument = (bytes: Uint8Array): boolean => {
  const head = new TextDecoder()
    .decode(bytes.slice(0, 1024))
    .replace(/^\uFEFF/u, "")
    .trimStart();
  return head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
};
