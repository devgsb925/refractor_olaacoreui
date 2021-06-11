import { TestBed } from '@angular/core/testing';

import { PendingOrderListService } from './pending-order-list.service';

describe('PendingOrderService', () => {
  let service: PendingOrderListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingOrderListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
