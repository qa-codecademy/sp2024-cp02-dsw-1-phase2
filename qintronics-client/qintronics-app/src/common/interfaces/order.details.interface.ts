export interface ProductsAndQuantity {
  productId: string;
  quantity: number;
}

export interface OrderDetails {
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  zip: number;
  prefDeliveryDate: string;
  isPaid?: boolean;
  productsAndQuantity: ProductsAndQuantity[];
}
