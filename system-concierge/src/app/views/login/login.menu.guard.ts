import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
export const LoginMenuGuard: CanActivateFn = (route, state) => {

    const router = inject(Router);
    const storage = inject(StorageService);

    if (storage.isLogged()) {
        return router.parseUrl('/dashboard');
    }
    return true;
};