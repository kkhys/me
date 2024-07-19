import { Text as _Text } from '@react-email/components';

export const Text = ({ children }: { children: React.ReactNode }) => (
  <_Text className='my-[24px] text-[14px] text-gray-900'>{children}</_Text>
);
