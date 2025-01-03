import {
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  SparklesIcon,
} from "lucide-react";

import { AlertDescription, AlertTitle, Alert as _Alert } from "@kkhys/ui";

enum AlertType {
  Note = "note",
  Tip = "tip",
  Important = "important",
  Warning = "warning",
}

const getTitle = (type: AlertType) => {
  switch (type) {
    case AlertType.Note:
      return "Note";
    case AlertType.Tip:
      return "Tip";
    case AlertType.Important:
      return "Important";
    case AlertType.Warning:
      return "Warning";
  }
};

const getIcon = (type: AlertType) => {
  switch (type) {
    case AlertType.Note:
      return <InfoIcon className="size-4" />;
    case AlertType.Tip:
      return <LightbulbIcon className="size-4" />;
    case AlertType.Important:
      return <SparklesIcon className="size-4" />;
    case AlertType.Warning:
      return <AlertTriangleIcon className="size-4" />;
  }
};

export const AlertBlock = ({
  type,
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
