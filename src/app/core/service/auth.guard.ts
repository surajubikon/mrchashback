import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { USER_STORAGE_KEY, USER_TYPES } from '../constant/app.constant';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate() {
    let storage = this.storageService.getFromStorage(USER_STORAGE_KEY);
    if (storage.user && storage.user.type === USER_TYPES.ADMIN) {
      this.router.navigate(['/dashboard/home']);
      return false;
    } else if (storage.user && storage.user.type === USER_TYPES.CUSTOMER) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
