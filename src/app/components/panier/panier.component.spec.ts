import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanierComponent } from './panier.component';
import { PanierService } from '../../services/panier.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

class MockPanierService {
  removeFromPanier = jasmine.createSpy('removeFromPanier');
  getTotalTTC = jasmine.createSpy('getTotalTTC').and.returnValue(100);
  getTotalTaxes = jasmine.createSpy('getTotalTaxes').and.returnValue(20);
}

describe('PanierComponent', () => {
  let component: PanierComponent;
  let fixture: ComponentFixture<PanierComponent>;
  let mockPanierService: MockPanierService;

  beforeEach(async () => {
    mockPanierService = new MockPanierService();

    await TestBed.configureTestingModule({
      imports: [PanierComponent],
      providers: [
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

    fixture = TestBed.createComponent(PanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have access to the panier service', () => {
    expect(component.panierService).toBeDefined();
  });

  it('should call removeFromPanier when removeItem is called', () => {
    const productId = 1;
    component.removeItem(productId);
    expect(mockPanierService.removeFromPanier).toHaveBeenCalledWith(productId);
  });

  it('should call getTotalTTC when getTotalTTC is called', () => {
    const result = component.getTotalTTC();
    expect(mockPanierService.getTotalTTC).toHaveBeenCalled();
    expect(result).toBe(100);
  });

  it('should call getTotalTaxes when getTotalTaxes is called', () => {
    const result = component.getTotalTaxes();
    expect(mockPanierService.getTotalTaxes).toHaveBeenCalled();
    expect(result).toBe(20);
  });
});
