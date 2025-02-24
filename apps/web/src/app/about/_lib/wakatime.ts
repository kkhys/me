import { excludedLanguage } from "#/app/about/_config";
import type { Summary } from "#/app/about/_types";

type AggregateBase = {
  total_seconds: number;
};

export type Aggregate = AggregateBase & {
  id: string;
  label: string;
  fill: string;
  color: string;
};

const updateAggregate = (
  current: AggregateBase,
  totalSeconds: number,
): AggregateBase => {
  const updatedTotalSeconds = current.total_seconds + totalSeconds;

  return {
    total_seconds: Math.floor(updatedTotalSeconds),
  };
};

export const getAggregateData = <K extends keyof Summary>(
  summaries: Summary[],
  key: K,
  size = 3,
): Aggregate[] => {
  const aggregate = new Map<string, AggregateBase>();

  for (const summary of summaries) {
    for (const { name, total_seconds } of summary[key]) {
      const current = aggregate.get(name) || { total_seconds: 0 };
      const updated = updateAggregate(current, total_seconds);
      aggregate.set(name, updated);
    }
  }

  const toSlug = (name: string) => name.toLowerCase().replace(/[\s_]+/g, "-");

  return Array.from(aggregate.entries(), ([name, data]) => {
    const slug = toSlug(name);
    const isLanguageKey = key === "languages";

    return {
      id: slug,
      label: name,
      fill: `var(--color-${slug})`,
      color: isLanguageKey
        ? `oklch(var(--${slug}))`
        : `oklch(var(--chart-${toSlug(key)}))`,
      ...data,
    };
  })
    .filter(({ label }) =>
      key === "languages" ? !excludedLanguage.includes(label) : true,
    )
    .sort((a, b) => b.total_seconds - a.total_seconds)
    .slice(0, size);
};
