import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostingModalComponent } from './boosting-modal.component';

describe('BoostingModalComponent', () => {
  let component: BoostingModalComponent;
  let fixture: ComponentFixture<BoostingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostingModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
