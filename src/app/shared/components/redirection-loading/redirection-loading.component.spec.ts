import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionLoadingComponent } from './redirection-loading.component';

describe('RedirectionLoadingComponent', () => {
  let component: RedirectionLoadingComponent;
  let fixture: ComponentFixture<RedirectionLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectionLoadingComponent]
    });
    fixture = TestBed.createComponent(RedirectionLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
