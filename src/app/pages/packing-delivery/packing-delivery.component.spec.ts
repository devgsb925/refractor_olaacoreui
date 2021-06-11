import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingDeliveryComponent } from './packing-delivery.component';

describe('PackingDeliveryComponent', () => {
  let component: PackingDeliveryComponent;
  let fixture: ComponentFixture<PackingDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackingDeliveryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
