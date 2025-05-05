import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFilterComponent } from './product-filter.component';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/product.model';

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent;
  let fixture: ComponentFixture<ProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with Category.ALL as default selectedCategory', () => {
    expect(component.selectedCategory).toBe(Category.ALL);
  });

  it('should emit filterChange with correct category when onCategoryChange is called', () => {
    const spy = spyOn(component.filterChange, 'emit');
    const testCategory = Category.FOOD;
    component.onCategoryChange(testCategory);
    expect(spy).toHaveBeenCalledWith(testCategory);
  });

  it('should update selectedCategory when onCategoryChange is called', () => {
    const testCategory = Category.MEDECINE;
    component.onCategoryChange(testCategory);
    expect(component.selectedCategory).toBe(testCategory);
  });
});
