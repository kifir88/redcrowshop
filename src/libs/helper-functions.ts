import {ProductCategory} from "@/types/woo-commerce/product-category";

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

export const getCategoryHierarchyBySlug = (categories: ProductCategory[], slug: string): ProductCategory[] => {
  const hierarchy: ProductCategory[] = [];

  function findParent(currentSlug: string) {
    const category = categories.find(cat => cat.slug === currentSlug);
    if (category) {
      hierarchy.unshift(category); // Add category to the beginning of the array
      if (category.parent !== 0) {
        const parentCategory = categories.find(cat => cat.id === category.parent);
        if (parentCategory) {
          findParent(parentCategory.slug); // Recursively find parent categories
        }
      }
    }
  }

  findParent(slug);
  return hierarchy;
}