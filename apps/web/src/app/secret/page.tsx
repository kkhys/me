import { auth, currentUser } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  return <h1>Hello, {user.username}</h1>;
};

export default Page;
