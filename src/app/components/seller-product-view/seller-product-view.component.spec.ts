import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductViewComponent } from './seller-product-view.component';

describe('SellerProductViewComponent', () => {
  let component: SellerProductViewComponent;
  let fixture: ComponentFixture<SellerProductViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
