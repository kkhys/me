export const missingClass = (string?: string, prefix?: string) => {
  if (!string) return true;
  const regex = new RegExp(` ?${prefix as string}`, 'g');
  return string.match(regex) === null;
};
