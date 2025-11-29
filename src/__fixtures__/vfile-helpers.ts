export const createVFile = (
  content: string,
  data: Record<string, unknown> = {},
) => {
  return {
    value: content,
    data,
  };
};
