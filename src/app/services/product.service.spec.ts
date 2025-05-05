import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Category, IProduct } from '../models/product.model';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockProducts: IProduct[] = [
    {
      id: 8,
      productName: 'Sapiens',
      price: 12.61,
      quantity: 8,
      isImported: false,
      category: Category.BOOKS,
    },
    {
      id: 16,
      productName: 'USB Flash Drive 64GB',
      price: 9.18,
      quantity: 8,
      isImported: true,
      category: Category.ELECTRICAL,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch and process products correctly', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual([
        {
          ...mockProducts[0],
          tax: 1.3,
          priceWithTaxes: 13.91,
        },
        {
          ...mockProducts[1],
          tax: 2.3,
          priceWithTaxes: 11.48,
        },
      ]);
    });

    const req = httpMock.expectOne('assets/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should return cached products if available', () => {
    const cachedProducts = [
      {
        id: 8,
        productName: 'Sapiens',
        price: 12.61,
        quantity: 8,
        isImported: false,
        category: Category.BOOKS,
        tax: 1.3,
        priceWithTaxes: 13.91,
      },
    ];

    service.allProducts = cachedProducts;

    service.getProducts().subscribe((products) => {
      expect(products).toBe(cachedProducts);
      expect(products).toEqual(cachedProducts);
    });

    httpMock.expectNone('assets/products.json');
  });

  it('should calculate tax amount correctly', () => {
    const product: IProduct = {
      id: 1,
      productName: 'Test Product',
      price: 100,
      quantity: 1,
      isImported: true,
      category: Category.BOOKS,
    };

    const taxAmount = service['calculateTaxAmount'](product);
    expect(taxAmount).toBe(15);
  });

  it('should calculate taxes correctly', () => {
    const product: IProduct = {
      id: 2,
      productName: 'Another Product',
      price: 50,
      quantity: 1,
      isImported: false,
      category: Category.BOOKS,
    };

    const taxRate = service['calculateTaxes'](product);
    expect(taxRate).toBe(10);
  });

  it('should round to the nearest 0.05 correctly', () => {
    expect(service['roundToNearestFiveCents'](0.99)).toBe(1.0);
    expect(service['roundToNearestFiveCents'](1.01)).toBe(1.05);
    expect(service['roundToNearestFiveCents'](1.02)).toBe(1.05);
  });

  it('should calculate taxes correctly for FOOD category', () => {
    const product: IProduct = {
      id: 3,
      productName: 'Organic Apple',
      price: 2.5,
      quantity: 10,
      isImported: false,
      category: Category.FOOD,
    };

    const taxRate = service['calculateTaxes'](product);
    expect(taxRate).toBe(0);

    product.isImported = true;
    const taxRateImported = service['calculateTaxes'](product);
    expect(taxRateImported).toBe(5);
  });

  it('should calculate taxes correctly for MEDECINE category', () => {
    const product: IProduct = {
      id: 4,
      productName: 'Aspirin',
      price: 5.99,
      quantity: 5,
      isImported: false,
      category: Category.MEDECINE,
    };

    const taxRate = service['calculateTaxes'](product);
    expect(taxRate).toBe(0);

    product.isImported = true;
    const taxRateImported = service['calculateTaxes'](product);
    expect(taxRateImported).toBe(5);
  });
});
