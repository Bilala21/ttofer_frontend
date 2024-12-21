import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoBoughtAdComponent } from './who-bought-ad.component';

describe('WhoBoughtAdComponent', () => {
  let component: WhoBoughtAdComponent;
  let fixture: ComponentFixture<WhoBoughtAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoBoughtAdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoBoughtAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
