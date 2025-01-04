import { GoogleMapsEmbed } from "@next/third-parties/google";

import { env } from "#/env";

export const GoogleMapsBlock = ({
  placeId,
  caption,
}: {
  placeId: string;
  caption?: string;
}) => {
  if (!caption) {
    return (
      <GoogleMapsEmbed
        apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        width="100%"
        mode="place"
        q={`place_id:${placeId}`}
        region="JP"
        style="border-radius: 1rem; aspect-ratio: 16 / 9;"
      />
    );
  }

  return (
    <figure>
      <GoogleMapsEmbed
        apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        width="100%"
        mode="place"
        q={`place_id:${placeId}`}
        region="JP"
        style="border-radius: 1rem; aspect-ratio: 16 / 9;"
      />
      <figcaption className="text-center text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
};
