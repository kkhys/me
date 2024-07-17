import { Container as _Container } from '@react-email/components';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <_Container className='mx-auto my-[40px] max-w-[672px] rounded border border-solid border-[#eaeaea] p-[20px]'>
    {children}
  </_Container>
);
