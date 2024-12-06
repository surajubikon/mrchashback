import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSidebarComponent } from './web-sidebar.component';

describe('WebSidebarComponent', () => {
  let component: WebSidebarComponent;
  let fixture: ComponentFixture<WebSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebSidebarComponent]
    });
    fixture = TestBed.createComponent(WebSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
