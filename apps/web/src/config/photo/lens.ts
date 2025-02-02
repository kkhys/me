export type Lens = Record<"name" | "manufacturer", string>;
export type LensName = Lens["name"];

export const lenses = [
  {
    name: "EF-S18-55mm f/3.5-5.6 IS II",
    manufacturer: "Canon",
  },
  {
    name: "EF-S55-250mm f/4-5.6 IS II",
    manufacturer: "Canon",
  },
  {
    name: "FE 55mm F1.8 ZA",
    manufacturer: "SONY",
  },
] satisfies Lens[];

export const lensNames = lenses.map(({ name }) => name);
