import { Container as EmailContainer } from "@react-email/components";

export const Container = ({ children }: { children: React.ReactNode }) => (
  <EmailContainer className="mx-auto my-[40px] max-w-[672px] rounded border border-solid border-[#eaeaea] p-[20px]">
    {children}
  </EmailContainer>
);
