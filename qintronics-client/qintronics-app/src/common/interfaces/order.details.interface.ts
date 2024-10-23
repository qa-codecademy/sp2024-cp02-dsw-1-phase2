export interface ProductsAndQuantity {
  productId: string;
  quantity: number;
}

export interface OrderDetails {
  address: string;
  city: string;
  zip: number;
  prefDeliveryDate: Date; // ????????
  isPaid?: boolean;
  productsAndQuantity: ProductsAndQuantity[];
}
