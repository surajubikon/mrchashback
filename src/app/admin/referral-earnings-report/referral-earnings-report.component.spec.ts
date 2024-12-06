import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralEarningsReportComponent } from './referral-earnings-report.component';

describe('ReferralEarningsReportComponent', () => {
  let component: ReferralEarningsReportComponent;
  let fixture: ComponentFixture<ReferralEarningsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralEarningsReportComponent]
    });
    fixture = TestBed.createComponent(ReferralEarningsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
