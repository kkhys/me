import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };

export * from "./accordion";
export * from "./alert";
export * from "./button";
export * from "./carousel";
export * from "./command";
export * from "./dialog";
export * from "./drawer";
export * from "./dropdown-menu";
export * from "./pagination";
export * from "./prose";
export * from "./scroll-area";
export * from "./skeleton";
export * from "./tabs";
export * from "./theme";
export * from "./tooltip";
