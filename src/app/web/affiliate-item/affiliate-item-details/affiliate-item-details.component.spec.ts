import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateItemDetailsComponent } from './affiliate-item-details.component';

describe('AffiliateItemDetailsComponent', () => {
  let component: AffiliateItemDetailsComponent;
  let fixture: ComponentFixture<AffiliateItemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateItemDetailsComponent]
    });
    fixture = TestBed.createComponent(AffiliateItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
