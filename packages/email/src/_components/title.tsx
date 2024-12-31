import { Heading } from "@react-email/components";

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Heading className="mb-[40px] text-[24px] font-bold text-gray-900">
    {children}
  </Heading>
);
