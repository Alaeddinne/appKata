export interface IProduct {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  isImported: boolean;
  category: Category;
  priceWithTaxes?: number;
  tax?: number;
}

export enum Category {
  BOOKS = 'Books',
  FOOD = 'Food',
  MEDECINE = 'Medecine',
  ELECTRICAL = 'Electrical',
  PARFUMS = 'Parfums',
  ALL = 'All',
}

export enum Page {
  HOME = 'articles',
  PANIER = 'panier',
}
