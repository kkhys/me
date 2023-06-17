import { type ComponentType } from 'react';
import Link, { type LinkProps } from 'next/link';

import { BasicLayout } from '#/features/global/ui';
import { SITE_METADATA } from '#/config';
import { Container, GitHubIcon, InstagramIcon, TwitterIcon } from '#/ui';

const SocialLink = ({
  icon: Icon,
  ...props
}: { icon: ComponentType<{ className: string }> } & LinkProps) => {
  return (
    <Link
      className='group -m-1 p-1'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    >
      <Icon className='h-6 w-6 fill-gray-500 transition group-hover:fill-gray-600 dark:fill-gray-400 dark:group-hover:fill-gray-300' />
    </Link>
  );
};

const SamplePage = () => {
  return (
    <BasicLayout>
      <Container className='mt-9'>
        <div className='max-w-2xl'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-3xl'>
            Keisuke Hayashi
          </h1>
          <p className='mt-6 text-base text-gray-600 dark:text-gray-400'>
            I’m a programmer based in Tokyo.
          </p>
          <div className='mt-6 flex gap-6'>
            <SocialLink
              href={SITE_METADATA.social.twitter.url}
              aria-label='Follow on Twitter'
              icon={TwitterIcon}
            />
            <SocialLink
              href={SITE_METADATA.social.instagram.url}
              aria-label='Follow on Instagram'
              icon={InstagramIcon}
            />
            <SocialLink
              href={SITE_METADATA.social.github.url}
              aria-label='Follow on GitHub'
              icon={GitHubIcon}
            />
          </div>
        </div>
      </Container>
    </BasicLayout>
  );
};

export default SamplePage;
