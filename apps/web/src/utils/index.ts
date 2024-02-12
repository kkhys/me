export const fisherYatesShuffle = <T>(array: T[]) => {
  const copy = [...array];

  copy.forEach((_, index, arr) => {
    const i = arr.length - 1 - index;
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  });

  return copy;
};
