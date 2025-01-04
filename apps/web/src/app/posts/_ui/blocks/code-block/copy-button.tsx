"use client";

import { cn } from "@kkhys/ui";
import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";

export const CopyButton = ({
  value,
  hasTitle,
}: {
  value: string;
  hasTitle: boolean;
}) => {
  const [copyCount, setCopyCount] = React.useState(0);
  const copied = copyCount > 0;

  React.useEffect(() => {
    if (copyCount > 0) {
      const timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [copyCount]);

  return (
    <button
      className={cn(
        "absolute right-4 flex items-center justify-center rounded-md border border-zinc-700 bg-transparent p-2 opacity-0 shadow-sm backdrop-blur transition hover:bg-zinc-800 hover:text-zinc-400 focus:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring group-hover:opacity-100",
        hasTitle ? "top-16" : "top-4",
      )}
      onClick={() =>
        void window.navigator.clipboard
          .writeText(value)
          .then(() => setCopyCount((count) => count + 1))
      }
      aria-label="Copy code to clipboard"
      type="button"
    >
      <span
        aria-hidden={copied}
        className={cn("transition duration-500", copied && "scale-0 opacity-0")}
      >
        <CopyIcon className="size-4 text-zinc-400" />
      </span>
      <span
        aria-hidden={!copied}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition duration-500",
          !copied && "scale-100 opacity-0",
        )}
      >
        <CheckIcon className="size-5 text-zinc-400" />
      </span>
    </button>
  );
};
