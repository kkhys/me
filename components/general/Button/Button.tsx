export type ButtonProps = {
  type: string;
};

export const Button = () => {
  return (
    <button
      type='button'
      className='rounded-md bg-indigo-500 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
    >
      Button text
    </button>
  );
};
