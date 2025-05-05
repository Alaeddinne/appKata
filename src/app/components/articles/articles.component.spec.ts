import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesComponent } from './articles.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, IProduct } from '../../models/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PanierService } from '../../services/panier.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductCardComponent } from './product-card/product-card.component';
import { CartItem } from '../../models/panier.model';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockPanierService: jasmine.SpyObj<PanierService>;
  let mockProducts: IProduct[];

  beforeEach(async () => {
    mockProducts = [
      {
        id: 14,
        productName: 'Apple - Fuji',
        price: 4.37,
        quantity: 3,
        isImported: true,
        category: Category.FOOD,
      },
      {
        id: 9,
        productName: 'Wireless Keyboard',
        price: 9.16,
        quantity: 5,
        isImported: false,
        category: Category.ELECTRICAL,
      },
    ];

    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'addToPanier',
    ]);
    mockProductService.getProducts.and.returnValue(of([...mockProducts]));

    mockProductService.allProducts = [...mockProducts];

    mockPanierService = jasmine.createSpyObj('PanierService', ['addToPanier']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        ProductCardComponent,
        ArticlesComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: PanierService, useValue: mockPanierService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    component.productsList$.subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });

  it('should initialize categories from products', () => {
    expect(component.categories).toContain(Category.FOOD);
    expect(component.categories).toContain(Category.ELECTRICAL);
    expect(component.categories.length).toBe(2);
  });

  it('should filter products by category when category is selected', () => {
    component.onCategoryChange(Category.FOOD);

    component.filteredProducts.subscribe((filtered) => {
      expect(filtered[0].category).toBe(Category.FOOD);
      expect(filtered[0].id).toBe(14);
    });
    expect(component.selectedCategory).toBe(Category.FOOD);
  });

  it('should show all products when ALL category is selected', () => {
    component.onCategoryChange(Category.ALL);

    component.filteredProducts.subscribe((filtered) => {
      expect(filtered.length).toBe(2);
      expect(filtered).toEqual(mockProductService.allProducts);
    });
    expect(component.selectedCategory).toBe(Category.ALL);
  });

  it('should add product to panier with specified quantity', () => {
    const product = mockProducts[0];
    const quantity = 2;
    const cartItem: CartItem = {
      product,
      quantity,
    };
    component.addToPanier(cartItem);
    expect(mockPanierService.addToPanier).toHaveBeenCalledWith(
      product,
      quantity
    );
  });

  it('should update product quantity in stock after adding to panier', () => {
    const productId = 14;
    const product = mockProductService.allProducts.find(
      (product) => product.id === productId
    )!;
    const initialQuantity = product.quantity;
    const purchaseQuantity = 2;
    const cartItem: CartItem = {
      product: { ...product },
      quantity: purchaseQuantity,
    };

    component.addToPanier(cartItem);

    const updatedProduct = mockProductService.allProducts.find(
      (p) => p.id === productId
    )!;
    expect(updatedProduct.quantity).toBe(initialQuantity - purchaseQuantity);
  });
});
