import { TestBed } from '@angular/core/testing';

import { DistributedDonationService } from './distributed-donation.service';

describe('DistributedDonationService', () => {
  let service: DistributedDonationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributedDonationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
