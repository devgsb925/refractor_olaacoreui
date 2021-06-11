import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgjSelectComponent } from './ngj-select.component';

describe('NgjSelectComponent', () => {
  let component: NgjSelectComponent;
  let fixture: ComponentFixture<NgjSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgjSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgjSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
