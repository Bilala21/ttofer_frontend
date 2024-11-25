import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLinkComponent } from './custom-link.component';

describe('CustomLinkComponent', () => {
  let component: CustomLinkComponent;
  let fixture: ComponentFixture<CustomLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
