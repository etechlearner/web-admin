import { TestBed } from '@angular/core/testing';

import { SubscriptionService } from './subscriptions.service';

describe('SubscriptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionService = TestBed.get(SubscriptionService);
    expect(service).toBeTruthy();
  });
});
