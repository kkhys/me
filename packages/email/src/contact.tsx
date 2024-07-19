import * as React from 'react';
import { Body, Head, Html, Preview, render, Section, Tailwind, Text } from '@react-email/components';

import { Container, Divider, Heading, Icons, Link, Title } from './_components';

interface ContactEmailProps {
  name: string;
  email: string;
  type: 'jobScouting' | 'projectConsultation' | 'feedback' | 'collaboration' | 'other';
  content: string;
}

const Email = ({ name, email, type, content }: ContactEmailProps) => {
  const typeLabel = (type: ContactEmailProps['type']) => {
    switch (type) {
      case 'jobScouting':
        return '転職スカウト';
      case 'projectConsultation':
        return '案件のご相談';
      case 'feedback':
        return '記事のフィードバック';
      case 'collaboration':
        return 'コラボレーションの提案';
      case 'other':
        return 'その他';
    }
  };

  return (
    <Html lang='ja' dir='ltr'>
      <Head />
      <Preview>お問い合わせありがとうございます。こちらは確認メールです。</Preview>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white px-2 font-sans'>
          <Container>
            <Section>
              <Icons.logo className='h-[20px] w-[20px] rounded-md' />
            </Section>
            <Title>Contact</Title>
            <Text>お問い合わせありがとうございます。</Text>
            <Text>以下の内容でお問い合わせを受け付けました。</Text>
            <Text>※ 必ずしも返信できるとは限らないことを予めご了承ください。</Text>
            <Section>
              <Heading>名前</Heading>
              <Text>{name}</Text>
              <Heading>メールアドレス</Heading>
              <Text>{email}</Text>
              <Heading>お問い合わせ種別</Heading>
              <Text>{typeLabel(type)}</Text>
              <Heading>お問い合わせ内容</Heading>
              <Text>{content}</Text>
            </Section>
            <Divider />
            <Text>
              <Link href='https://kkhys.me'>kkhys.me</Link> by Keisuke Hayashi
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

Email.PreviewProps = {
  email: 'kkhys@pm.me',
  name: 'Keisuke Hayashi',
  type: 'jobScouting',
  content: 'お問い合わせです。',
} satisfies ContactEmailProps;

export default Email;

export const contactMail = ({ email, name, type, content }: ContactEmailProps) =>
  render(<Email email={email} name={name} type={type} content={content} />, {
    pretty: true,
  });
