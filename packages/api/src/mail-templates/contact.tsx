import { Button, Html, render } from '@react-email/components';

interface ContactEmailProps {
  email: string;
  name: string;
  content: string;
}

// FIXME
const Email = ({ email, name, content }: ContactEmailProps) => {
  return (
    <Html lang='ja' dir='ltr'>
      <Button href='https://example.com' style={{ color: '#61dafb' }}>
        Click me
      </Button>
      <p>{email}</p>
      <p>{name}</p>
      <p>{content}</p>
    </Html>
  );
};

export const contactMail = ({ email, name, content }: ContactEmailProps) =>
  render(<Email email={email} name={name} content={content} />, {
    pretty: true,
  });
