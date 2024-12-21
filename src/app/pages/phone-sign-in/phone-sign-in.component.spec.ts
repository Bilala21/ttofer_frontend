import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneSignInComponent } from './phone-sign-in.component';

describe('PhoneSignInComponent', () => {
  let component: PhoneSignInComponent;
  let fixture: ComponentFixture<PhoneSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneSignInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
