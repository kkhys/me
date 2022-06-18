const hex2rgb = (hex: string) => {
  let h = hex;
  if (h.slice(0, 1) === '#') h = h.slice(1);
  if (h.length === 3)
    h =
      h.slice(0, 1) +
      h.slice(0, 1) +
      h.slice(1, 2) +
      h.slice(1, 2) +
      h.slice(2, 3) +
      h.slice(2, 3);
  return [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((str: string) =>
    parseInt(str, 16),
  );
};

const hex2rgba = (hex: string, alpha: number) => [...hex2rgb(hex), alpha];

const hex2hsl = (hex: string) => {
  const rgb = hex2rgb(hex);
  const r = (rgb[0] as number) / 255;
  const g = (rgb[1] as number) / 255;
  const b = (rgb[2] as number) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h: number;
  const s = (diff / (1 - Math.abs(max + min - 1))) * 100;
  const l = ((max + min) / 2) * 100;

  switch (min) {
    case max:
      h = 0;
      break;
    case r:
      h = 60 * ((b - g) / diff) + 180;
      break;
    case g:
      h = 60 * ((r - b) / diff) + 300;
      break;
    case b:
      h = 60 * ((g - r) / diff) + 60;
      break;
    default:
      h = 0;
  }
  return [Math.round(h), Math.round(s), Math.round(l)];
};

export { hex2rgb, hex2rgba, hex2hsl };
