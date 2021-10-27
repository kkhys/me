import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import svgNew from "../svg/categories/new.svg";
import svgFashion from "../svg/categories/fashion.svg";
import svgTech from "../svg/categories/tech.svg";
import svgLife from "../svg/categories/life.svg";
import svgOnsen from "../svg/categories/onsen.svg";

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
        <CategoryLink catName="New" catIcon={svgNew} catLink="/" path={path} currentPage={currentPage} />
        <CategoryLink catName="Tech" catIcon={svgTech} catLink="/t" path={path} currentPage={currentPage} />
        <CategoryLink catName="Fashion" catIcon={svgFashion} catLink="/f" path={path} currentPage={currentPage} />
        <CategoryLink catName="Onsen" catIcon={svgOnsen} catLink="/o" path={path} currentPage={currentPage} />
        <CategoryLink catName="Life" catIcon={svgLife} catLink="/l" path={path} currentPage={currentPage} />
      </CategoryItemList>
    </Nav>
  );
};

const Nav = styled.nav`
  display: block;
  margin: 0;
`;

const CategoryItemList = styled.ul`
  display: flex;
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    margin: 0 -20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
      display: none;
    }

    &:after {
      content: "";
      width: 40px;
      flex: 0 0 auto;
    }
  }
`;

const CategoryItem = styled.li`
  width: 70px;
  margin: 0 20px 0 0;
  text-align: center;
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    width: 60px;
    flex: 0 0 auto;
    margin: 0 0 0 15px;
  }

  .cat-item__link {
    color: #c9d1d9;
  }

  .cat-item__image {
    padding: 2px;
    background: ${props => props.theme.colors.blackLight};
    border-radius: 50%;
    position: relative;

    img {
      position: relative;
      background: ${props => props.theme.colors.blackLight};
      border-radius: 50%;
      display: block;
      z-index: 2;
    }
  }

  .cat-item__name {
    margin-top: 5px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: ${props => props.theme.colors.gray};
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      font-size: 12px;
    }
  }

  &.active {
    .cat-item__image:after {
      content: "";
      position: absolute;
      display: block;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${props => props.theme.colors.gradient};
      animation: rotating 2s linear infinite;
    }

    img {
      border: solid 2px ${props => props.theme.colors.background};
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default CategoryMenu;
