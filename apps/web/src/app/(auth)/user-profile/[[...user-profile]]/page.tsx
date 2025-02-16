import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { UserProfile } from "#/app/(auth)/_ui";

export const metadata = {
  robots: "noindex",
  title: "User Profile",
  description: "user profile page of Keisuke Hayashi.",
  alternates: {
    canonical: "/user-profile",
  },
  openGraph: {
    url: "/user-profile",
  },
} satisfies Metadata;

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <div className="flex justify-center *:font-sans">
      <UserProfile />
    </div>
  );
};

export default Page;
