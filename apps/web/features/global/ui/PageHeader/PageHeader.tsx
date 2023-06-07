import clsx from 'clsx';

export const PageHeader = ({
  title,
  description,
  className,
  ...props
}: {
  title: string;
  description?: string;
} & JSX.IntrinsicElements['header']) => {
  return (
    <header className={clsx('max-w-3xl', className)} {...props}>
      <h1 className='text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-4xl'>
        {title}
      </h1>
      {description && (
        <p className='mt-6 text-base text-gray-600 dark:text-gray-400'>
          {description}
        </p>
      )}
    </header>
  );
};
