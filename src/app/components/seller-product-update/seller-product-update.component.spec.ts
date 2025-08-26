import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductUpdateComponent } from './seller-product-update.component';

describe('SellerProductUpdateComponent', () => {
  let component: SellerProductUpdateComponent;
  let fixture: ComponentFixture<SellerProductUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
