import { Prose } from "@kkhys/ui";
import { allLegals } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { notFound } from "next/navigation";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { siteConfig } from "#/config";

const JsonLd = ({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) => {
  const jsonLdBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${siteConfig.url}/${slug}`,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdBreadcrumbList),
      }}
    />
  );
};

export const generateStaticParams = async () =>
  allLegals.map(({ slug }) => ({ legalSlug: slug }));

const Page = async ({ params }: { params: Promise<{ legalSlug: string }> }) => {
  const { legalSlug } = await params;

  const legal = allLegals.find((legal) => legal.slug === legalSlug);

  if (!legal) {
    notFound();
  }

  const {
    title,
    body: { html },
    publishedAt,
    updatedAt,
  } = legal;

  return (
    <>
      <JsonLd name={title} slug={legalSlug} />
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
