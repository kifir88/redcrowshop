import {ProductCategory} from "@/hooks/product-categories/useProductCategories";

const getAllCategoryIds = (categories: ProductCategory[], parentId: number): number[] => {
  const result: number[] = [];

  const findChildren = (currentParentId: number) => {
    const children = categories.filter(
      category => category.parent === currentParentId
    );
    children.forEach(child => {
      result.push(child.id);
      findChildren(child.id);
    });
  }

  findChildren(parentId);

  return result;
}

export const getAllCategoryIdsBySlug = (categories: ProductCategory[], parentSlug: string): number[] => {
  const result: number[] = [];

  function findChildren(currentParentId: number) {
    const children = categories.filter(category => category.parent === currentParentId);
    children.forEach(child => {
      result.push(child.id);
      findChildren(child.id); // Recursively find children of each child
    });
  }

  const parentCategory = categories.find(category => category.slug === parentSlug);
  if (parentCategory) {
    findChildren(parentCategory.id); // Start from the parent category
  }

  return result;
}