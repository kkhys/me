import React from 'react';
import * as styles from './styles';
import type { FC } from 'react';

type CategoryBadgeProps = {
  slug?: string;
  categoryObjects: Record<'name' | 'slug' | 'color', string>[] | undefined;
  isLink?: boolean;
};

const CategoryBadge: FC<CategoryBadgeProps> = ({
  slug,
  categoryObjects,
  isLink = false,
}) => {
  if (!slug) return null;
  const categoryObject = categoryObjects?.find(
    (category) => category.slug === slug,
  );
  const categoryName = categoryObject ? categoryObject.name : '無分類';
  const categoryColor = categoryObject ? categoryObject.color : ''; // FIXME
  const content = <span css={styles.badge(categoryColor)}>{categoryName}</span>;
  return isLink ? <div>{content}</div> : <div>{content}</div>;
};

export default CategoryBadge;
