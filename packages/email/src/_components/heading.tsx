import { Heading as EmailHeading } from "@react-email/components";

export const Heading = ({ children }: { children: React.ReactNode }) => (
  <EmailHeading className="mb-[12px] mt-[24px] text-[18px] font-bold text-gray-900">
    {children}
  </EmailHeading>
);
