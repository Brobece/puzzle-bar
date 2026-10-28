import { categories, products, productImages, allergens, productAllergens } from './mock-data';
import type { PublicCatalog } from './types';

// Public read model. Private/inactive records never reach the client component.
export function getPublicCatalog(): PublicCatalog {
  const visibleCategories = categories.filter(category => category.active).sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleProducts = visibleCategories.flatMap(category => products
    .filter(product => product.active && product.categoryId === category.id)
    .map(product => ({
      ...product,
      category: { id: category.id, name: category.name, slug: category.slug },
      images: productImages.filter(image => image.productId === product.id).sort((a, b) => a.displayOrder - b.displayOrder),
      allergens: productAllergens.filter(link => link.productId === product.id).map(link => ({
        ...allergens.find(allergen => allergen.id === link.allergenId)!, noticeType: link.noticeType,
      })),
    })));
  return { categories: visibleCategories, products: visibleProducts };
}
