import * as React from "react";
import { Link } from "gatsby";
import svgNew from "../../../svg/categories/new.svg";
import svgFashion from "../../../svg/categories/fashion.svg";
import svgTech from "../../../svg/categories/tech.svg";
import svgLife from "../../../svg/categories/life.svg";
import svgOnsen from "../../../svg/categories/onsen.svg";
import { Nav, CategoryItemList, CategoryItem } from "./styles";

const CategoryLink = ({ catName, catIcon, catLink, path, currentPage }) => {
  const pathInclude =
    currentPage === 1
      ? path === catLink
      : catLink === "/"
      ? path === `/${currentPage}/`
      : path === `${catLink}/${currentPage}/`;
  return (
    <CategoryItem className={pathInclude && "active"}>
      <Link to={catLink} className="cat-item__link">
        <div className="cat-item__image">
          <img src={catIcon} alt={catName} />
        </div>
        <div className="cat-item__name">{catName}</div>
      </Link>
    </CategoryItem>
  );
};

const CategoryMenu = ({ location, currentPage }) => {
  const path = location.pathname;
  return (
    <Nav>
      <CategoryItemList>
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
      </CategoryItemList>
    </Nav>
  );
};

export default CategoryMenu;
