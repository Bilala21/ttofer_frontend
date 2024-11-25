import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBoostingComponent } from './post-boosting.component';

describe('PostBoostingComponent', () => {
  let component: PostBoostingComponent;
  let fixture: ComponentFixture<PostBoostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostBoostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostBoostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
