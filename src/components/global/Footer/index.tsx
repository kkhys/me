// FIXME
// @ts-nocheck
import Link from 'next/link';

import { Container } from '@/components/elements';

const NavLink = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
  children: string;
  isExternal?: boolean;
}) => {
  const styles = 'transition hover:text-teal-500 dark:hover:text-teal-400';
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
      <Container.Outer>
        <div className='border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40'>
          <Container.Inner>
            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
              <div className='flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200'>
                <NavLink
                  href='https://github.com/users/kkhys/projects/1'
                  isExternal
                >
                  Roadmap
                </NavLink>
              </div>
              <p className='text-sm text-zinc-400 dark:text-zinc-500'>
                CC BY-NC-SA 4.0 2023-PRESENT &copy; Keisuke Hayashi
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  );
};
