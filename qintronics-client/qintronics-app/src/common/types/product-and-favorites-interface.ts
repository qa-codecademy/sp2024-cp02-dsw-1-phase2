import { BaseProduct } from "./products-interface";

export interface ProductAndFavFlag extends BaseProduct {
  isFavorite: boolean;
}
