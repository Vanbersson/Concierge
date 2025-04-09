import { Inject, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

export const vehicleEntryGuard: CanActivateFn = (route, state) => {

  const permission = '100';
  const storage = inject(StorageService);
  const permission_arr: string[] = storage.permissions.split(",");

  if (permission_arr.includes(permission)) {
    return true;
  }

  return false;
};
