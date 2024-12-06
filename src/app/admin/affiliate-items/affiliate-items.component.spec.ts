import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateItemsComponent } from './affiliate-items.component';

describe('AffiliateItemsComponent', () => {
  let component: AffiliateItemsComponent;
  let fixture: ComponentFixture<AffiliateItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateItemsComponent]
    });
    fixture = TestBed.createComponent(AffiliateItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
