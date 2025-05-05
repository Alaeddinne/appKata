import { TestBed } from '@angular/core/testing';
import { PanierService } from './panier.service';
import { ProductService } from './product.service';
import { Category, IProduct } from '../models/product.model';

describe('PanierService', () => {
  let service: PanierService;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: IProduct[] = [
    {
      id: 13,
      productName: 'Sponge Cake Mix - Chocolate',
      price: 1.4,
      priceWithTaxes: 1.68,
      tax: 0.28,
      quantity: 10,
      isImported: true,
      category: Category.FOOD,
    },
    {
      id: 3,
      productName: 'The Stranger in the Lifeboat',
      price: 16.38,
      priceWithTaxes: 19.656,
      tax: 3.276,
      quantity: 7,
      isImported: true,
      category: Category.BOOKS,
    },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts']);
    spy.allProducts = [...mockProducts];

    TestBed.configureTestingModule({
      providers: [PanierService, { provide: ProductService, useValue: spy }],
    });
    service = TestBed.inject(PanierService);
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new product to the Panier', (done) => {
    const product = mockProducts[0];
    const quantity = 2;

    service.addToPanier(product, quantity);

    service.panierItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(quantity);
      done();
    });
  });

  it('should increase quantity for existing product in cart', (done) => {
    const product = mockProducts[0];

    service.addToPanier(product, 2);

    service.addToPanier(product, 3);

    service.panierItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(5);
      done();
    });
  });

  it('should update panierItemCount$ after adding product', () => {
    const product = mockProducts[0];

    service.addToPanier(product, 2);

    expect(service.panierItemCount$.getValue()).toBe(2);
  });

  it('should correctly calculate total TTC for multiple items', () => {
    service.addToPanier(mockProducts[0], 2);
    service.addToPanier(mockProducts[1], 1);
    expect(service.getTotalTTC()).toBe(23.016);
  });

  it('should correctly calculate total taxes for multiple items', () => {
    service.addToPanier(mockProducts[0], 2);
    service.addToPanier(mockProducts[1], 1);
    expect(service.getTotalTaxes()).toBe(3.836);
  });

  describe('removeFromPanier', () => {
    beforeEach(() => {
      service.addToPanier(mockProducts[0], 2);
      service.addToPanier(mockProducts[1], 3);
      productServiceSpy.allProducts = JSON.parse(JSON.stringify(mockProducts));
    });

    it('should remove product from Panier', (done) => {
      service.removeFromPanier(13);

      service.panierItems$.subscribe((items) => {
        expect(items.length).toBe(1);
        expect(items[0].product.id).toBe(3);
        done();
      });
    });

    it('should update panierItemCount$ after removing product', () => {
      expect(service.panierItemCount$.getValue()).toBe(5);
      service.removeFromPanier(13);
      expect(service.panierItemCount$.getValue()).toBe(3);
    });
  });
});
