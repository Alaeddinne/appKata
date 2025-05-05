import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../models/product.model';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-filter.component.html',
})
export class ProductFilterComponent {
  @Input() categories!: Category[];
  @Output() filterChange: EventEmitter<Category> = new EventEmitter<Category>();
  public selectedCategory = Category.ALL;
  public Category = Category;

  onCategoryChange(event: Category): void {
    this.selectedCategory = event;
    this.filterChange.emit(event);
  }
}
