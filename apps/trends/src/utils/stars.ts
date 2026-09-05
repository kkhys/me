export interface StarCounts {
  filled: number;
  empty: number;
}

/* ★ counts for the interest level out of 3. Level 1 means "weak or no
   match", which is no signal to the reader, so it renders nothing. */
export const interestStars = (interest: number): StarCounts | undefined =>
  interest >= 2 ? { filled: interest, empty: 3 - interest } : undefined;
