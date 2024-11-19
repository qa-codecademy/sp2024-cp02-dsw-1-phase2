export interface Specifications {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  camera: string;
  battery: string;
  os: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  img: string;
  specifications: any;
  price: number;
  warranty: string;
  availability: number;
  discount: number;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  next: boolean;
  prev: boolean;
}
