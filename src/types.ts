export interface Product {
  id: string;
  _id?: string; // ← Add this for MongoDB products
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  discountedPrice?: number;
  in_stock: boolean;
  featured?: boolean;
  category?: string;
  category_id?: string;
  collection_id?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}
