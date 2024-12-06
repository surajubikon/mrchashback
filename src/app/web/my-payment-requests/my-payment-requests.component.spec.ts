import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaymentRequestsComponent } from './my-payment-requests.component';

describe('MyPaymentRequestsComponent', () => {
  let component: MyPaymentRequestsComponent;
  let fixture: ComponentFixture<MyPaymentRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPaymentRequestsComponent]
    });
    fixture = TestBed.createComponent(MyPaymentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
