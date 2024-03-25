import { TestBed } from '@angular/core/testing';

import { AtendementoService } from './atendemento.service';

describe('AtendementoService', () => {
  let service: AtendementoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtendementoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
