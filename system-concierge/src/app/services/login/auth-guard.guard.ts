import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const storage = inject(StorageService);

  if (!storage.companyId || !storage.resaleId || !storage.id || !storage.name || !storage.email || !storage.token || !storage.roleDesc) {
    storage.deleteStorage();
    router.navigateByUrl("/login");
    return false;
  }

  return true;
};
