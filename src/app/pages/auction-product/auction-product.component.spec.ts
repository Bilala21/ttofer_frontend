  import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionProductComponent } from './auction-product.component';

describe('AuctionProductComponent', () => {
  let component: AuctionProductComponent;
  let fixture: ComponentFixture<AuctionProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
