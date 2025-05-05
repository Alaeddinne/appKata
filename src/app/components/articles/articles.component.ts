import { Component } from '@angular/core';
import { Category, IProduct, Page } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PanierService } from '../../services/panier.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { MenuComponent } from '../shared/menu/menu.component';
import { CartItem } from '../../models/panier.model';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    ProductCardComponent,
    FormsModule,
    CommonModule,
    ProductCardComponent,
    ProductFilterComponent,
    RouterModule,
    MenuComponent,
  ],
  templateUrl: './articles.component.html',
})
export class ArticlesComponent {
  public productsList$: Observable<IProduct[]>;
  public categories: Category[] = [];
  public selectedCategory: Category = Category.ALL;
  filteredProducts: BehaviorSubject<IProduct[]> = new BehaviorSubject<
    IProduct[]
  >([]);
  public Page = Page;

  constructor(
    private productService: ProductService,
    public panierService: PanierService
  ) {
    this.productsList$ = this.productService.getProducts().pipe(
      tap((products) => {
        this.productService.allProducts = products;
        this.filteredProducts.next(products);
        this.categories = Array.from(
          new Set(products.map((product) => product.category))
        );
      })
    );
  }

  public onCategoryChange(category: Category): void {
    this.selectedCategory = category;
    if (category === Category.ALL) {
      this.filteredProducts.next(this.productService.allProducts);
    } else {
      this.filteredProducts.next(
        this.productService.allProducts.filter(
          (product) => product.category === category
        )
      );
    }
  }

  public addToPanier(event: CartItem): void {
    this.panierService.addToPanier(event.product, event.quantity);

    const productInStock = this.productService.allProducts.find(
      (product) => product.id === event.product.id
    );
    if (productInStock) {
      productInStock.quantity = productInStock.quantity - event.quantity;
    }
  }
}
