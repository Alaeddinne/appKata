import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierService } from '../../services/panier.service';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { MenuComponent } from '../shared/menu/menu.component';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, ProductListComponent, RouterModule, MenuComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss',
})
export class PanierComponent {
  constructor(public panierService: PanierService) {}

  public removeItem(productId: number): void {
    this.panierService.removeFromPanier(productId);
  }

  public getTotalTTC(): number {
    return this.panierService.getTotalTTC();
  }

  public getTotalTaxes(): number {
    return this.panierService.getTotalTaxes();
  }
}
