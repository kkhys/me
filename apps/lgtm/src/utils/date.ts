/* UTC getters: frontmatter dates are date-only and parse as UTC midnight, so
   local getters would shift the day on builds west of UTC. */
export const formatDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};
