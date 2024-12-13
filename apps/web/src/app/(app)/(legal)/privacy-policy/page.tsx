import { Prose } from "@kkhys/ui";
import { allLegals } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { notFound } from "next/navigation";

const Page = () => {
  const privacyPolicy = allLegals.find(
    (legal) => legal.title === "Privacy Policy",
  );

  if (!privacyPolicy) {
    return notFound();
  }

  const {
    title,
    body: { html },
    publishedAt,
    updatedAt,
  } = privacyPolicy;

  return (
    <>
      <h1 className="font-sans font-medium">{title}</h1>
      <Prose>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <p className="mb-2 flex justify-end">
          {format(parseISO(publishedAt), "yyyy年M月d日", { locale: ja })} 制定
        </p>
        {updatedAt && (
          <p className="mt-2 flex justify-end">
            {format(parseISO(updatedAt), "yyyy年M月d日", { locale: ja })} 改定
          </p>
        )}
      </Prose>
    </>
  );
};

export default Page;
