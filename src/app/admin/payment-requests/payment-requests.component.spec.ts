import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestsComponent } from './payment-requests.component';

describe('PaymentRequestsComponent', () => {
  let component: PaymentRequestsComponent;
  let fixture: ComponentFixture<PaymentRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentRequestsComponent]
    });
    fixture = TestBed.createComponent(PaymentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
