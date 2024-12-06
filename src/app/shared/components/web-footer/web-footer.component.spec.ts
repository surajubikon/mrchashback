import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFooterComponent } from './web-footer.component';

describe('WebFooterComponent', () => {
  let component: WebFooterComponent;
  let fixture: ComponentFixture<WebFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebFooterComponent]
    });
    fixture = TestBed.createComponent(WebFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
