import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

export const AuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const storage = inject(StorageService);

  if (!storage.isLogged()) {
    storage.deleteStorage();
    return router.parseUrl('/login'); 
  }
  return true;
};
