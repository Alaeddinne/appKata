import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {  IProduct } from '../models/product.model';
import { ProductService } from './product.service';
import { CartItem } from '../models/panier.model';

@Injectable({
  providedIn: 'root',
})

export class PanierService {
  panierItemCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public panierItems$: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);

  constructor(private productService: ProductService) {}

  public addToPanier(product: IProduct, quantity: number) {
    const currentItems = this.panierItems$.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({
        product,
        quantity,
      });
    }
    this.panierItems$.next([...currentItems]);
    this.updateItemCount();
  }

  public getTotalTTC(): number {
    return this.panierItems$.value.reduce(
      (total, item) => total + item.product.priceWithTaxes! * item.quantity,
      0
    );
  }

  public getTotalTaxes(): number {
    return this.panierItems$.value.reduce(
      (total, item) => total + item.product.tax! * item.quantity,
      0
    );
  }

  public removeFromPanier(productId: number) {
    const currentItems = this.panierItems$.value;
    const itemToRemove = currentItems.find(
      (item) => item.product.id === productId
    );

    if (itemToRemove) {
      const productInStock = this.productService.allProducts.find(
        (product) => product.id === productId
      );
      if (productInStock) {
        productInStock.quantity! += itemToRemove.quantity;
      }
    }

    const updatedItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.panierItems$.next(updatedItems);
    this.updateItemCount();
  }

  private updateItemCount() {
    const count = this.panierItems$.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
    this.panierItemCount$.next(count);
  }
}
