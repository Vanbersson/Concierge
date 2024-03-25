import { CanMatchFn } from '@angular/router';

export const authRouterGuard: CanMatchFn = (route, segments) => {
  return true;
};
