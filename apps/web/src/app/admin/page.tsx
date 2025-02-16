import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkRole } from "#/utils/role";

export const metadata = {
  robots: "noindex",
} satisfies Metadata;

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
