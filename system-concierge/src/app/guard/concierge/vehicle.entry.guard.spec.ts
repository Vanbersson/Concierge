import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { vehicleEntryGuard } from './vehicle.entry.guard';

describe('vehicleEntryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => vehicleEntryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
