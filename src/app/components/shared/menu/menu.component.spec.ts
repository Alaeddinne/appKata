import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { PanierService } from '../../../services/panier.service';

describe('NavbarComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let panierServiceMock: jasmine.SpyObj<PanierService>;
  let mockPanierItemCount$: BehaviorSubject<number>;

  beforeEach(async () => {
    mockPanierItemCount$ = new BehaviorSubject<number>(0);
    panierServiceMock = jasmine.createSpyObj('PanierService', [], {
      panierItemCount$: mockPanierItemCount$,
    });

    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterTestingModule],
      providers: [{ provide: PanierService, useValue: panierServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
