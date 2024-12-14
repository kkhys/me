import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };

export * from "./button";
export * from "./command";
export * from "./dialog";
export * from "./drawer";
export * from "./dropdown-menu";
export * from "./prose";
export * from "./scroll-area";
export * from "./theme";
export * from "./tooltip";
