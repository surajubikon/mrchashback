import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateItemCardComponent } from './affiliate-item-card.component';

describe('AffiliateItemCardComponent', () => {
  let component: AffiliateItemCardComponent;
  let fixture: ComponentFixture<AffiliateItemCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateItemCardComponent]
    });
    fixture = TestBed.createComponent(AffiliateItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
