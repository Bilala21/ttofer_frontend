import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemoduleComponent } from './profilemodule.component';

describe('ProfilemoduleComponent', () => {
  let component: ProfilemoduleComponent;
  let fixture: ComponentFixture<ProfilemoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilemoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilemoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
