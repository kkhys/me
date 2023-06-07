import Link from 'next/link';

import { InnerContainer, OuterContainer } from '#/ui';

const NavigationLink = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
  children: string;
  isExternal?: boolean;
}) => {
  const styles = 'transition hover:text-cyan-500 dark:hover:text-cyan-400';
  return isExternal ? (
    <a href={href} target='_blank' rel='noreferrer noopener' className={styles}>
      {children}
    </a>
  ) : (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
};

export const Footer = () => {
  return (
    <footer className='mt-32'>
      <OuterContainer>
        <div className='border-t border-gray-100 pb-16 pt-10 dark:border-gray-700/40'>
          <InnerContainer>
            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
              <div className='flex gap-6 text-sm font-medium text-gray-800 dark:text-gray-200'>
                <NavigationLink
                  href='https://github.com/users/kkhys/projects/1'
                  isExternal
                >
                  Roadmap
                </NavigationLink>
              </div>
              <p className='text-sm text-gray-400 dark:text-gray-500'>
                CC BY-NC-SA 4.0 2023-PRESENT &copy; Keisuke Hayashi
              </p>
            </div>
          </InnerContainer>
        </div>
      </OuterContainer>
    </footer>
  );
};
