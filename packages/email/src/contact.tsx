import type { z } from 'zod';
import * as React from 'react';
import {
  Heading as _Heading,
  Body,
  Head,
  Html,
  Preview,
  render,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import type { ContactSchema } from '@kkhys/validators';

import { Container, Divider, Heading, Icons, Link, Title } from './_components';

type ContactEmailProps = Pick<z.infer<typeof ContactSchema>, 'name' | 'email' | 'type' | 'content'>;

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
          <_Heading className='sr-only'>kkhys.me</_Heading>
          <Container>
            <Title>Contact</Title>
            <Text>お問い合わせありがとうございます。</Text>
            <Text>以下の内容でお問い合わせを受け付けました。</Text>
            <Text>※ 必ずしも返信できるとは限りませんのでご了承ください。</Text>
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
            <Section>
              <Icons.logo />
              <Text>
                <Link href='https://kkhys.me'>kkhys.me</Link> by Keisuke Hayashi
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

Email.PreviewProps = {
  email: 'kkhys@example.com',
  name: 'Keisuke Hayashi',
  type: 'projectConsultation',
  content: `吾輩は猫である。名前はまだ無い`,
} satisfies ContactEmailProps;

export default Email;

export const contactMail = ({ email, name, type, content }: ContactEmailProps) => {
  return {
    html: render(<Email email={email} name={name} type={type} content={content} />, {
      pretty: true,
    }),
    text: render(<Email email={email} name={name} type={type} content={content} />, {
      plainText: true,
    }),
  };
};
