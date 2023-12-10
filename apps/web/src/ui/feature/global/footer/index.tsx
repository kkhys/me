import { ContainerInner, ContainerOuter } from '#/ui/feature/global';

export const Footer = () => (
  <footer className='mt-32 flex-none'>
    <ContainerOuter>
      <div className='border-t border-zinc-100 pb-6 pt-6 dark:border-zinc-700/40'>
        <ContainerInner>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200'>
              {/*<NavLink href="/about">About</NavLink>*/}
            </div>
            <p className='text-sm text-zinc-400 dark:text-zinc-500'>
              CC BY-NC-SA 4.0 2023-PRESENT &copy; Keisuke Hayashi
            </p>
          </div>
        </ContainerInner>
      </div>
    </ContainerOuter>
  </footer>
);
