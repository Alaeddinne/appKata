import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from './product-card.component';
import { Category, IProduct } from '../../../models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: IProduct = {
    id: 18,
    productName: 'Wine - Touraine Azay - Le - Rideau',
    price: 6.02,
    quantity: 4,
    isImported: true,
    category: Category.FOOD,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addToPanierEvent when addToPanier is called', () => {
    spyOn(component.addToPanierEvent, 'emit');
    const quantity = 2;
    component.addToPanier(mockProduct, quantity);
    expect(component.addToPanierEvent.emit).toHaveBeenCalledWith({
      product: mockProduct,
      quantity: quantity,
    });
  });

  it('should reset quantityToAdd to 0 after calling addToPanier', () => {
    component.quantityToAdd = 3;
    component.addToPanier(mockProduct, 3);
    expect(component.quantityToAdd).toBe(0);
  });
});
