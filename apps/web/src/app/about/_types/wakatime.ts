type Base = {
  name: string;
  total_seconds: number;
};

export type Summary = {
  languages: Base[];
  editors: Base[];
  operating_systems: Base[];
  categories: Base[];
};
