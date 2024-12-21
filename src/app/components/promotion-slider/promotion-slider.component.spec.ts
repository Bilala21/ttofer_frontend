import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionSliderComponent } from './promotion-slider.component';

describe('PromotionSliderComponent', () => {
  let component: PromotionSliderComponent;
  let fixture: ComponentFixture<PromotionSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
