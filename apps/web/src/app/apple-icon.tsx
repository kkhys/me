import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

const AppleIcon = async () => {
  const interMedium = await fetch(
    new URL("../../assets/fonts/Inter-Medium.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: "#0a0a0b",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter",
        color: "#e4e4e7",
        paddingTop: 10,
      }}
    >
      K
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interMedium,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
};

export default AppleIcon;
