import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { Router } from '@angular/router';

export const DriverMenuGuard: CanActivateFn = (route, state) => {

  const menu = '1_3';
  const storage = inject(StorageService);
  const router = inject(Router);

  const permission_arr: string[] = storage.menus.split(",");

  if (permission_arr.includes(menu)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
