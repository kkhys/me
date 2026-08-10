export type ScoreLevel = "hi" | "mid" | "lo";

export const scoreLevel = (score: number): ScoreLevel =>
  score >= 80 ? "hi" : score >= 60 ? "mid" : "lo";
