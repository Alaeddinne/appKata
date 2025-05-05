import { IProduct } from "./product.model";

export interface CartItem {
    product: IProduct;
    quantity: number;
  }
  