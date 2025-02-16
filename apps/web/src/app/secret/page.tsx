import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "#/app/(auth)/_lib/queries";

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const u = await getUserByClerkId(user.id);

  if (!u) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      <h1>Hello, {user.username}.</h1>
      <p>Your user id is {u.id}</p>
    </div>
  );
};

export default Page;
