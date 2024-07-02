import { TestBed } from '@angular/core/testing';

import { ClientecompanyService } from './clientecompany.service';

describe('ClientecompanyService', () => {
  let service: ClientecompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientecompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
