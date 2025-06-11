import useSWR from "swr";
import { SpotifyIcon } from "#/components/ui/icons/spotify";
import { client } from "#/lib/client";
import { fetcher } from "#/lib/hono";
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
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="grid place-content-center size-10 shadow-sm rounded-[8px] bg-background border">
            <SpotifyIcon className="size-5 [&>path]:fill-foreground" />
          </div>
          <p className="my-2 text-sm text-muted-foreground line-clamp-2">
            {error instanceof Error
              ? error.message
              : "Spotifyのデータを取得できませんでした。"}
          </p>
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
          <div className="hidden md:flex items-end gap-[1px] h-8 w-full pb-4 pr-4">
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
        className="aspect-square h-full p-2 md:p-4 hover:bg-foreground/2 rounded-md active:bg-foreground/6 transition duration-200 active:scale-95"
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
