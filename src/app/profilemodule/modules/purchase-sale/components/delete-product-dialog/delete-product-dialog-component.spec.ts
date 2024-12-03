import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingDialogeComponent } from './account-setting-dialoge.component';

describe('AccountSettingDialogeComponent', () => {
  let component: AccountSettingDialogeComponent;
  let fixture: ComponentFixture<AccountSettingDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingDialogeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
