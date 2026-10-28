export type Category = {
  id: string;
  establishmentId: string;
  name: string;
  slug: string;
  displayOrder: number;
  active: boolean;
};
export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  // Decimal text mirrors DECIMAL(12,2); convert only for display, never billing.
  price: string;
  preparationStation: 'BAR' | 'COZINHA' | 'SEM_PREPARO';
  active: boolean;
  available: boolean;
  alcoholic: boolean;
};
export type ProductImage = {
  id: string;
  productId: string;
  storageKey: string;
  altText: string;
  displayOrder: number;
};
export type Allergen = { id: string; name: string; code: string };
export type ProductAllergen = {
  productId: string;
  allergenId: string;
  noticeType: 'CONTAINS' | 'MAY_CONTAIN';
};
export type CatalogProduct = Product & {
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  images: ProductImage[];
  allergens: (Allergen & { noticeType: ProductAllergen['noticeType'] })[];
};
export type PublicCatalog = { categories: Category[]; products: CatalogProduct[] };
