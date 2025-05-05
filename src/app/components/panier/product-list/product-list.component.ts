import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/panier.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  @Input() dataCartItem!: CartItem;
  @Output() removeItemEvent = new EventEmitter<number>();

  removeItem(productId: number) {
    this.removeItemEvent.emit(productId);
  }
}
