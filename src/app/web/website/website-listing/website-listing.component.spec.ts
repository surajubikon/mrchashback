import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteListingComponent } from './website-listing.component';

describe('WebsiteListingComponent', () => {
  let component: WebsiteListingComponent;
  let fixture: ComponentFixture<WebsiteListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteListingComponent]
    });
    fixture = TestBed.createComponent(WebsiteListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
