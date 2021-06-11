import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJselectModalComponent } from './ng-jselect-modal.component';

describe('NgJselectModalComponent', () => {
  let component: NgJselectModalComponent;
  let fixture: ComponentFixture<NgJselectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgJselectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJselectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
