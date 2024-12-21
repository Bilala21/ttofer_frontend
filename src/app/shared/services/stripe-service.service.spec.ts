import { TestBed } from '@angular/core/testing';

import { StripeServiceService } from './stripe-service.service';

describe('StripeServiceService', () => {
  let service: StripeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
