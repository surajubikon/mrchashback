import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralEarningsComponent } from './referral-earnings.component';

describe('ReferralEarningsComponent', () => {
  let component: ReferralEarningsComponent;
  let fixture: ComponentFixture<ReferralEarningsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralEarningsComponent]
    });
    fixture = TestBed.createComponent(ReferralEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
