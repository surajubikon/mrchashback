import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateItemListingComponent } from './affiliate-item-listing.component';

describe('AffiliateItemListingComponent', () => {
  let component: AffiliateItemListingComponent;
  let fixture: ComponentFixture<AffiliateItemListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateItemListingComponent]
    });
    fixture = TestBed.createComponent(AffiliateItemListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
