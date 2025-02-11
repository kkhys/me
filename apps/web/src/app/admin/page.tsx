import { redirect } from "next/navigation";
import { checkRole } from "#/utils/role";

const Page = async () => {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <p>
      This is the protected admin dashboard restricted to users with the `admin`
      role.
    </p>
  );
};

export default Page;
