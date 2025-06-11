import useSWR from "swr";
import { SpotifyIcon } from "#/components/ui/icons/spotify";
import { client } from "#/lib/client";
import { fetcher } from "#/lib/hono";
import { cn } from "#/lib/ui.ts";
import type { SpotifyData } from "#/pages/api/_services/spotify";

interface Props {
  initialData?: SpotifyData;
}

export const NowPlaying = ({ initialData }: Props) => {
  const { data, error } = useSWR(
    "spotify",
    fetcher(() => client.api.spotify.$get()),
    {
      refreshInterval: 10000,
      ...(initialData && { fallbackData: initialData }),
    },
  );

  if (error && !data) {
    return (
      <div
        className={cn(
          "size-full shadow-input flex justify-between gap-4 shadow-sm rounded-xl border bg-background p-4 dark:shadow-none",
          "col-span-1 row-span-1 md:col-span-4 aspect-[2/1]",
        )}
      >
        <div className="flex flex-col justify-between w-full">
          <div>
            <div className="grid place-content-center size-10 shadow-sm rounded-[8px] bg-background border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2931 2931"
                width="2931"
                height="2931"
                className="size-5"
              >
                <title>Spotify</title>
                <path
                  className="fill-foreground"
                  d="M1465.5 0C656.1 0 0 656.1 0 1465.5S656.1 2931 1465.5 2931 2931 2274.9 2931 1465.5C2931 656.2 2274.9.1 1465.5 0zm672.1 2113.6c-26.3 43.2-82.6 56.7-125.6 30.4-344.1-210.3-777.3-257.8-1287.4-141.3-49.2 11.3-98.2-19.5-109.4-68.7-11.3-49.2 19.4-98.2 68.7-109.4C1242.1 1697.1 1721 1752 2107.3 1988c43 26.5 56.7 82.6 30.3 125.6zm179.3-398.9c-33.1 53.8-103.5 70.6-157.2 37.6-393.8-242.1-994.4-312.2-1460.3-170.8-60.4 18.3-124.2-15.8-142.6-76.1-18.2-60.4 15.9-124.1 76.2-142.5 532.2-161.5 1193.9-83.3 1646.2 194.7 53.8 33.1 70.8 103.4 37.7 157.1zm15.4-415.6c-472.4-280.5-1251.6-306.3-1702.6-169.5-72.4 22-149-18.9-170.9-91.3-21.9-72.4 18.9-149 91.4-171 517.7-157.1 1378.2-126.8 1922 196 65.1 38.7 86.5 122.8 47.9 187.8-38.5 65.2-122.8 86.7-187.8 48z"
                />
              </svg>
            </div>
            <p className="my-2 text-sm text-muted-foreground line-clamp-2">
              {error instanceof Error
                ? error.message
                : "Spotifyのデータを取得できませんでした。"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="grid place-content-center size-10 shadow-sm rounded-[8px] bg-background border">
            <SpotifyIcon className="size-5 [&>path]:fill-foreground" />
          </div>
          <div className="my-2 text-sm font-semibold line-clamp-2">
            {data?.title}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {data?.artist}
          </div>
        </div>
        {data?.isPlaying && (
          <div className="flex items-end gap-[1px] h-8 w-full pb-4 pr-4">
            {Array.from({ length: 60 }, (_, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="w-[2px] bg-green-500 rounded-sm flex-1 dark:bg-green-400"
                style={{
                  height: "2px",
                  animation: `sound-bar ${800 + Math.random() * 400}ms ${Math.random() * -2000}ms linear infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <a
        href={data?.songUrl}
        target="_blank"
        rel="noreferrer"
        className="aspect-square h-full p-4 hover:bg-foreground/2 rounded-md active:bg-foreground/6 transition duration-200 active:scale-95"
      >
        <img
          src={data?.albumImageUrl}
          alt={data?.isPlaying ? "Now Playing Song" : "Last Played Song"}
          className="aspect-square rounded-sm size-full object-cover shadow-sm"
        />
      </a>
    </>
  );
};
