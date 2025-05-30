import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import { Prose } from "@kkhys/ui/prose";
import { allLegals } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { siteConfig } from "#/config/site";

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

export const generateMetadata = async ({
  params,
}: { params: Promise<{ legalSlug: string }> }) => {
  const { legalSlug } = await params;
  const legal = allLegals.find((legal) => legal.slug === legalSlug);
  if (!legal) {
    return;
  }
  const { title, description, slug, publishedAt, updatedAt } = legal;
  const url = `/${slug}`;

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
    },
  } satisfies Metadata;
};

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
    <section>
      <JsonLd name={title} slug={legalSlug} />
      <FadeInStagger>
        <FadeIn>
          <h1 className="font-sans font-medium">{title}</h1>
        </FadeIn>
        <FadeIn>
          <Prose>
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <p className="mb-2 flex justify-end">
              {format(parseISO(publishedAt), "yyyy年M月d日", { locale: ja })}{" "}
              制定
            </p>
            {updatedAt && (
              <p className="mt-2 flex justify-end">
                {format(parseISO(updatedAt), "yyyy年M月d日", { locale: ja })}{" "}
                改定
              </p>
            )}
          </Prose>
        </FadeIn>
      </FadeInStagger>
    </section>
  );
};

export default Page;
