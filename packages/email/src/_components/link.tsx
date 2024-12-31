import { Link as EmailLink } from "@react-email/components";

export const Link = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => (
  <EmailLink href={href} className="text-blue-600 no-underline">
    {children}
  </EmailLink>
);
