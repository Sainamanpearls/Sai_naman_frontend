export interface Product {
  id: string;
  _id?: string; 
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

  size?: string | null;
  color?: string | null;

  hasSize?: boolean;
  hasColor?: boolean;
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
