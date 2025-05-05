import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Page } from '../../../models/product.model';
import { PanierService } from '../../../services/panier.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @Input() public page: Page = Page.HOME;
  public Page = Page;

  constructor(public panierService: PanierService) {}
}
