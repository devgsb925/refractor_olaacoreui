import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUiLayoutComponent } from './app-ui-layout.component';

describe('AppUiLayoutComponent', () => {
  let component: AppUiLayoutComponent;
  let fixture: ComponentFixture<AppUiLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUiLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUiLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
