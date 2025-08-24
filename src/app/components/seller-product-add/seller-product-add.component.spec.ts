import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductAddComponent } from './seller-product-add.component';

describe('SellerProductAddComponent', () => {
  let component: SellerProductAddComponent;
  let fixture: ComponentFixture<SellerProductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
