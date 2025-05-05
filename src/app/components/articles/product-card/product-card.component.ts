import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../models/product.model';
import { CartItem } from '../../../models/panier.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() dataProduct!: IProduct;
  @Output() addToPanierEvent = new EventEmitter<CartItem>();
  public quantityToAdd: number = 0;

  addToPanier(product: IProduct, quantity: number) {
    this.quantityToAdd = 0;
    this.addToPanierEvent.emit({ product, quantity });
  }
}
