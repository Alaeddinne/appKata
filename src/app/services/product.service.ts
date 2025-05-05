import { Injectable } from '@angular/core';
import { Category, IProduct } from '../models/product.model';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public allProducts: IProduct[] = [];

  constructor(private http: HttpClient) {}

  public getProducts(): Observable<IProduct[]> {
    if (this.allProducts.length > 0) {
      return of(this.allProducts);
    }
    return this.http.get<IProduct[]>('assets/products.json').pipe(
      map((products: IProduct[]) => {
        return products.map((product) => {
          const taxAmount: number = this.calculateTaxAmount(product);
          return {
            ...product,
            tax: taxAmount,
            priceWithTaxes: product.price + taxAmount,
          };
        });
      })
    );
  }

  private calculateTaxAmount(product: IProduct): number {
    const taxRate: number = this.calculateTaxes(product);
    return this.roundToNearestFiveCents((product.price * taxRate) / 100);
  }

  private calculateTaxes(product: IProduct): number {
    let tax: number = 0;

    switch (product.category) {
      case Category.FOOD:
      case Category.MEDECINE:
        tax += 0;
        break;
      case Category.BOOKS:
        tax += 10;
        break;
      default:
        tax += 20;
    }

    if (product.isImported) {
      tax += 5;
    }

    return tax;
  }

  private roundToNearestFiveCents(value: number): number {
    return Math.ceil(value * 20) / 20;
  }
}
