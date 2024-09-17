import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const storage = inject(StorageService);

  if (!storage.token || !storage.roleDesc || !storage.name || !storage.photo) {
    storage.deleteStorage();
    router.navigateByUrl("/login");
    return false;
  }

  return true;
};
