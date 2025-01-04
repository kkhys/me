import { Text as EmailText } from "@react-email/components";

export const Text = ({ children }: { children: React.ReactNode }) => (
  <EmailText className="my-[24px] text-[14px] text-gray-900">
    {children}
  </EmailText>
);
