import { env } from "#/env";

export const ViewCounter = ({ slug }: { slug: string }) => {
  if (env.NODE_ENV === "development") {
    return <p className="font-sans text-sm text-muted-foreground">xxx views</p>;
  }

  return (
    <p className="font-sans text-sm text-muted-foreground">
      {/*{data.toLocaleString()} views*/}0 views
    </p>
  );
};
