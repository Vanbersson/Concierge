import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { authRouterGuard } from './auth-router.guard';

describe('authRouterGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authRouterGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
