import { type ComponentType, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { Footer, Header } from '#/features/global/ui';
import portraitImage from '#/assets/portrait.jpg';
import { SITE_METADATA } from '#/config';
import {
  Container,
  GitHubIcon,
  InstagramIcon,
  MailIcon,
  TwitterIcon,
} from '#/ui';

const SocialLink = ({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string;
  href: string;
  children: ReactNode;
  icon: ComponentType<{ className: string }>;
}) => {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className='group flex text-sm font-medium text-gray-800 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-500'
      >
        <Icon className='h-6 w-6 flex-none fill-gray-500 transition group-hover:fill-teal-500' />
        <span className='ml-4'>{children}</span>
      </Link>
    </li>
  );
};

const AboutPage = () => {
  return (
    <>
      <Header />
      <Container className='mt-16 sm:mt-32'>
        <div className='grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12'>
          <div className='lg:pl-20'>
            <div className='max-w-xs px-2.5 lg:max-w-none'>
              <Image
                src={portraitImage}
                alt=''
                sizes='(min-width: 1024px) 32rem, 20rem'
                className='aspect-square rotate-3 rounded-2xl bg-gray-100 object-cover dark:bg-gray-800'
              />
            </div>
          </div>
          <div className='lg:order-first lg:row-span-2'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl'>
              Sample heading
            </h1>
            <div className='mt-6 space-y-7 text-base text-gray-600 dark:text-gray-400'>
              <p>
                「ではみなさんは、そういうふうに川だと云いわれたり、乳の流れたあとだと云われたりしていたこのぼんやりと白いものがほんとうは何かご承知ですか。」
                先生は、黒板に吊つるした大きな黒い星座の図の、上から下へ白くけぶった銀河帯のようなところを指さしながら、みんなに問といをかけました。
              </p>
              <p>
                カムパネルラが手をあげました。それから四五人手をあげました。ジョバンニも手をあげようとして、急いでそのままやめました。
                たしかにあれがみんな星だと、いつか雑誌で読んだのでしたが、このごろはジョバンニはまるで毎日教室でもねむく、本を読むひまも読む本もないので、なんだかどんなこともよくわからないという気持ちがするのでした。
              </p>
              <p>ところが先生は早くもそれを見附みつけたのでした。</p>
              <p>「ジョバンニさん。あなたはわかっているのでしょう。」</p>
              <p>
                ジョバンニは勢よく立ちあがりましたが、立って見るともうはっきりとそれを答えることができないのでした。
                ザネリが前の席からふりかえって、ジョバンニを見てくすっとわらいました。
                ジョバンニはもうどぎまぎしてまっ赤になってしまいました。先生がまた云いました。
              </p>
            </div>
          </div>
          <div className='lg:pl-20'>
            <ul role='list'>
              <SocialLink
                href={SITE_METADATA.social.twitter.url}
                icon={TwitterIcon}
              >
                Follow on Twitter
              </SocialLink>
              <SocialLink
                href={SITE_METADATA.social.instagram.url}
                icon={InstagramIcon}
                className='mt-4'
              >
                Follow on Instagram
              </SocialLink>
              <SocialLink
                href={SITE_METADATA.social.github.url}
                icon={GitHubIcon}
                className='mt-4'
              >
                Follow on GitHub
              </SocialLink>
              <SocialLink
                href={`mailto:${SITE_METADATA.email}`}
                icon={MailIcon}
                className='mt-8 border-t border-gray-100 pt-8 dark:border-gray-700/40'
              >
                {SITE_METADATA.email}
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;
