import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductComponent } from './seller-product.component';

describe('SellerProductComponent', () => {
  let component: SellerProductComponent;
  let fixture: ComponentFixture<SellerProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
