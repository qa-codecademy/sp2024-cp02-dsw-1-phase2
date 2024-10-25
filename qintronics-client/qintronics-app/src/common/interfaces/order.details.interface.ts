export interface ProductsAndQuantity {
  productId: string;
  quantity: number;
}

export interface OrderDetails {
  address: string;
  city: string;
  zip: number;
  prefDeliveryDate: string;
  isPaid?: boolean;
  productsAndQuantity: ProductsAndQuantity[];
}
