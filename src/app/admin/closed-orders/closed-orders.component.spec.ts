import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedOrdersComponent } from './closed-orders.component';

describe('ClosedOrdersComponent', () => {
  let component: ClosedOrdersComponent;
  let fixture: ComponentFixture<ClosedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClosedOrdersComponent]
    });
    fixture = TestBed.createComponent(ClosedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
