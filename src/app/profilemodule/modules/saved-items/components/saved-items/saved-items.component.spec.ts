import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedItemsComponent } from './saved-items.component';

describe('SavedItemsComponent', () => {
  let component: SavedItemsComponent;
  let fixture: ComponentFixture<SavedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
