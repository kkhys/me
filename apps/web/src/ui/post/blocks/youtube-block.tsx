import { YouTubeEmbed } from "@next/third-parties/google";

export const YouTubeBlock = ({ videoId }: { videoId: string }) => {
  const params = "mute=1";
  const styleBackgroundImage = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const styles = `background-image: url('${styleBackgroundImage}'); border-radius: 1rem; border: 1px solid #474747;`;

  return (
    <div className="before:[&>div>lite-youtube]:content-none">
      <YouTubeEmbed videoid={videoId} params={params} style={styles} />
    </div>
  );
};
