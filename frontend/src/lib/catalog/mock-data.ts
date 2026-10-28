import type { Allergen, Category, Product, ProductAllergen, ProductImage } from './types';

// Fictional fixtures. IDs are local references, not production UUIDs.
export const categories: Category[] = [
  { id: 'cat-drinks', establishmentId: 'stereo', name: 'Drinks', slug: 'drinks', displayOrder: 1, active: true },
  { id: 'cat-beers', establishmentId: 'stereo', name: 'Cervejas', slug: 'cervejas', displayOrder: 2, active: true },
  { id: 'cat-food', establishmentId: 'stereo', name: 'Pra dividir', slug: 'pra-dividir', displayOrder: 3, active: true },
  { id: 'cat-zero', establishmentId: 'stereo', name: 'Sem álcool', slug: 'sem-alcool', displayOrder: 4, active: true },
  { id: 'cat-seasonal', establishmentId: 'stereo', name: 'Sazonais', slug: 'sazonais', displayOrder: 5, active: false },
];
export const products: Product[] = [
  { id: 'p-neon', categoryId: 'cat-drinks', name: 'Neon Tônica', slug: 'neon-tonica', description: 'Gin, tônica e uma combinação de limão e alecrim. Cítrico, refrescante e feito para acompanhar o começo da noite. Taça de 350 ml.', price: '32.00', preparationStation: 'BAR', active: true, available: true, alcoholic: true },
  { id: 'p-stereo', categoryId: 'cat-drinks', name: 'Stereo Sour', slug: 'stereo-sour', description: 'Vodka, maracujá, limão e espuma de aquafaba. Um encontro entre o azedinho da fruta e um final suave. Taça de 180 ml.', price: '30.00', preparationStation: 'BAR', active: true, available: true, alcoholic: true },
  { id: 'p-sunset', categoryId: 'cat-drinks', name: 'Sunset Spritz', slug: 'sunset-spritz', description: 'Aperitivo de laranja, espumante e água com gás. Leve amargor, laranja fresca e muito gelo. Taça de 350 ml.', price: '34.00', preparationStation: 'BAR', active: true, available: false, alcoholic: true },
  { id: 'p-lager', categoryId: 'cat-beers', name: 'Lager da Casa', slug: 'lager-da-casa', description: 'Cerveja lager de perfil leve, dourada e refrescante, com amargor delicado. Copo de 400 ml.', price: '16.00', preparationStation: 'BAR', active: true, available: true, alcoholic: true },
  { id: 'p-ipa', categoryId: 'cat-beers', name: 'IPA Frequência', slug: 'ipa-frequencia', description: 'Cerveja de amargor marcante, aroma cítrico e notas de frutas tropicais. Copo de 400 ml.', price: '22.00', preparationStation: 'BAR', active: true, available: true, alcoholic: true },
  { id: 'p-burger', categoryId: 'cat-food', name: 'Mini Burgers', slug: 'mini-burgers', description: 'Três mini burgers de carne bovina, queijo, picles e maionese da casa, servidos em pães macios. Porção com 3 unidades.', price: '42.00', preparationStation: 'COZINHA', active: true, available: true, alcoholic: false },
  { id: 'p-fries', categoryId: 'cat-food', name: 'Fritas da Mesa', slug: 'fritas-da-mesa', description: 'Batatas fritas crocantes com páprica e alecrim, acompanhadas de maionese de alho. Porção de 400 g.', price: '28.00', preparationStation: 'COZINHA', active: true, available: true, alcoholic: false },
  { id: 'p-bites', categoryId: 'cat-food', name: 'Dadinho & Groove', slug: 'dadinho-e-groove', description: 'Dadinhos de tapioca com queijo coalho, dourados por fora e macios por dentro. Acompanha geleia de pimenta. Porção com 10 unidades.', price: '32.00', preparationStation: 'COZINHA', active: true, available: true, alcoholic: false },
  { id: 'p-citrus', categoryId: 'cat-zero', name: 'Citrus Beat', slug: 'citrus-beat', description: 'Limão, laranja, xarope de gengibre e água com gás. Um drink cítrico e refrescante, sem álcool. Copo de 350 ml.', price: '20.00', preparationStation: 'BAR', active: true, available: true, alcoholic: false },
  { id: 'p-tea', categoryId: 'cat-zero', name: 'Chá Rosa', slug: 'cha-rosa', description: 'Infusão gelada de hibisco, morango e um toque de limão. Leve, frutada e servida com gelo. Copo de 350 ml.', price: '18.00', preparationStation: 'BAR', active: true, available: true, alcoholic: false },
  { id: 'p-water', categoryId: 'cat-zero', name: 'Água com Gás', slug: 'agua-com-gas', description: 'Água mineral com gás, servida gelada. Garrafa de 500 ml.', price: '7.00', preparationStation: 'SEM_PREPARO', active: true, available: true, alcoholic: false },
  { id: 'p-archived', categoryId: 'cat-drinks', name: 'Drink arquivado', slug: 'drink-arquivado', description: 'Fixture inativa para verificar publicação.', price: '25.00', preparationStation: 'BAR', active: false, available: true, alcoholic: true },
  { id: 'p-seasonal', categoryId: 'cat-seasonal', name: 'Especial sazonal', slug: 'especial-sazonal', description: 'Fixture de categoria inativa.', price: '26.00', preparationStation: 'BAR', active: true, available: true, alcoholic: false },
];
const artwork: Record<string, string> = {
  'p-neon': 'gin', 'p-stereo': 'sour', 'p-sunset': 'spritz', 'p-lager': 'beer',
  'p-ipa': 'ipa', 'p-burger': 'burger', 'p-fries': 'fries', 'p-bites': 'bites',
  'p-citrus': 'citrus', 'p-tea': 'tea', 'p-water': 'water',
};
export const productImages: ProductImage[] = Object.entries(artwork).map(([productId, file]) => ({
  id: `img-${productId}`, productId, storageKey: `/images/menu/${file}.svg`,
  altText: `Ilustração demonstrativa de ${products.find(product => product.id === productId)!.name}`,
  displayOrder: 0,
}));
export const allergens: Allergen[] = [
  { id: 'a-gluten', name: 'Glúten', code: 'GLUTEN' },
  { id: 'a-milk', name: 'Leite', code: 'MILK' },
  { id: 'a-eggs', name: 'Ovos', code: 'EGGS' },
  { id: 'a-soy', name: 'Soja', code: 'SOY' },
  { id: 'a-sulfites', name: 'Sulfitos', code: 'SULFITES' },
];
// Explicit fictional declarations for these recipes, never inferred from names.
export const productAllergens: ProductAllergen[] = [
  { productId: 'p-lager', allergenId: 'a-gluten', noticeType: 'CONTAINS' },
  { productId: 'p-ipa', allergenId: 'a-gluten', noticeType: 'CONTAINS' },
  { productId: 'p-sunset', allergenId: 'a-sulfites', noticeType: 'CONTAINS' },
  { productId: 'p-burger', allergenId: 'a-gluten', noticeType: 'CONTAINS' },
  { productId: 'p-burger', allergenId: 'a-milk', noticeType: 'CONTAINS' },
  { productId: 'p-burger', allergenId: 'a-eggs', noticeType: 'CONTAINS' },
  { productId: 'p-burger', allergenId: 'a-soy', noticeType: 'MAY_CONTAIN' },
  { productId: 'p-fries', allergenId: 'a-eggs', noticeType: 'CONTAINS' },
  { productId: 'p-fries', allergenId: 'a-gluten', noticeType: 'MAY_CONTAIN' },
  { productId: 'p-bites', allergenId: 'a-milk', noticeType: 'CONTAINS' },
];
