import * as React from "react";
import { Link } from "gatsby";
import svgNew from "@/svg/categories/new.svg";
import svgFashion from "@/svg/categories/fashion.svg";
import svgTech from "@/svg/categories/tech.svg";
import svgLife from "@/svg/categories/life.svg";
import svgOnsen from "@/svg/categories/onsen.svg";
import * as styles from "./styles";

const CategoryLink = ({ catName, catIcon, catLink, path, currentPage }) => {
  const pathInclude =
    currentPage === 1
      ? path === catLink
      : catLink === "/"
      ? path === `/${currentPage}/`
      : path === `${catLink}/${currentPage}/`;
  const isActive = pathInclude ? "active" : "";
  return (
    <li css={styles.item()} className={isActive}>
      <Link to={catLink} css={styles.link()}>
        <div className="cat-item__img">
          <img src={catIcon} alt={catName} />
        </div>
        <div css={styles.name()}>{catName}</div>
      </Link>
    </li>
  );
};

const CategoryMenu = ({ location, currentPage }) => {
  const path = location.pathname;
  return (
    <nav css={styles.nav()}>
      <ul css={styles.list()}>
        <CategoryLink
          catName="New"
          catIcon={svgNew}
          catLink="/"
          path={path}
          currentPage={currentPage}
        />
        <CategoryLink
          catName="Tech"
          catIcon={svgTech}
          catLink="/t"
          path={path}
          currentPage={currentPage}
        />
        <CategoryLink
          catName="Fashion"
          catIcon={svgFashion}
          catLink="/f"
          path={path}
          currentPage={currentPage}
        />
        <CategoryLink
          catName="Onsen"
          catIcon={svgOnsen}
          catLink="/o"
          path={path}
          currentPage={currentPage}
        />
        <CategoryLink
          catName="Life"
          catIcon={svgLife}
          catLink="/l"
          path={path}
          currentPage={currentPage}
        />
      </ul>
    </nav>
  );
};

export default CategoryMenu;
