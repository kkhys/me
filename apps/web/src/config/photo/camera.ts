export type Camera = Record<"name" | "manufacturer", string>;
export type CameraName = Camera["name"];

export const cameras = [
  {
    name: "Canon EOS 60D",
    manufacturer: "Canon",
  },
  {
    name: "ILCE-7CM2",
    manufacturer: "SONY",
  },
] satisfies Camera[];

export const cameraNames = cameras.map(({ name }) => name);
