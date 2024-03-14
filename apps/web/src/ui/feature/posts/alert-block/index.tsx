import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AlertTriangleIcon, LightbulbIcon, SparklesIcon } from 'lucide-react';

import { Alert as _Alert, AlertDescription, AlertTitle } from '#/ui/feedback';

enum AlertType {
  Note = 'note',
  Tip = 'tip',
  Important = 'important',
  Warning = 'warning',
}

const getTitle = (type: AlertType) => {
  switch (type) {
    case AlertType.Note:
      return 'Note';
    case AlertType.Tip:
      return 'Tip';
    case AlertType.Important:
      return 'Important';
    case AlertType.Warning:
      return 'Warning';
  }
};

const getIcon = (type: AlertType) => {
  switch (type) {
    case AlertType.Note:
      return <InfoCircledIcon className='size-4' />;
    case AlertType.Tip:
      return <LightbulbIcon className='size-4' />;
    case AlertType.Important:
      return <SparklesIcon className='size-4' />;
    case AlertType.Warning:
      return <AlertTriangleIcon className='size-4' />;
  }
};

export const Alert = ({
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
      <AlertTitle className='font-sans'>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </_Alert>
  );
};
