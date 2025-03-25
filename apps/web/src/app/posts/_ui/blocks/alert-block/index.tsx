import {
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  SparklesIcon,
} from "lucide-react";

import { AlertDescription, AlertTitle, Alert as _Alert } from "@kkhys/ui/alert";

type AlertType = "note" | "tip" | "important" | "warning";

const getTitle = (type: AlertType) => {
  switch (type) {
    case "note":
      return "Note";
    case "tip":
      return "Tip";
    case "important":
      return "Important";
    case "warning":
      return "Warning";
  }
};

const getIcon = (type: AlertType) => {
  switch (type) {
    case "note":
      return <InfoIcon className="size-4" />;
    case "tip":
      return <LightbulbIcon className="size-4" />;
    case "important":
      return <SparklesIcon className="size-4" />;
    case "warning":
      return <AlertTriangleIcon className="size-4" />;
  }
};

export const AlertBlock = ({
  type = "note",
  description,
  className,
}: {
  type: AlertType;
  description: string;
  className?: string;
}) => {
  const title = getTitle(type);
  const Icon = getIcon(type);

  return (
    <_Alert className={className}>
      {Icon}
      <AlertTitle className="font-sans">{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </_Alert>
  );
};
