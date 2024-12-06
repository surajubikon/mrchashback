import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingCashbackComponent } from './missing-cashback.component';

describe('MissingCashbackComponent', () => {
  let component: MissingCashbackComponent;
  let fixture: ComponentFixture<MissingCashbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingCashbackComponent]
    });
    fixture = TestBed.createComponent(MissingCashbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
