import { TestBed } from '@angular/core/testing';

import { VehicleEntryService } from './vehicle-entry.service';

describe('VehicleEntryService', () => {
  let service: VehicleEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
