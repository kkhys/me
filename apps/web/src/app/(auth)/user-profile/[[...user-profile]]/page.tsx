import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "#/app/(auth)/_ui";

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
