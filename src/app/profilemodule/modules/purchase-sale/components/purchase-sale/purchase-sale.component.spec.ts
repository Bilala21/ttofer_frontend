import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSaleComponent } from './purchase-sale.component';

describe('PurchaseSaleComponent', () => {
  let component: PurchaseSaleComponent;
  let fixture: ComponentFixture<PurchaseSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
