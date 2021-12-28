import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const CategoryJsonLD = ({ categorySlug, categoryName }) => {
  const { site } = useStaticQuery<GatsbyTypes.CategoryJsonLDQuery>(
    graphql`
      query CategoryJsonLD {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  );

  const { siteUrl } = site.siteMetadata;
  const jsonBreadCrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": siteUrl,
          name: "HOME",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": `${siteUrl}/${categorySlug}`,
          name: categoryName,
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonBreadCrumbs)}
      </script>
    </Helmet>
  );
};

export default CategoryJsonLD;
