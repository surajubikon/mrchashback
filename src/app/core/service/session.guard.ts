import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { USER_STORAGE_KEY, USER_TYPES } from '../constant/app.constant';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class SessionGuard implements CanActivate {
  private _toastService = inject(NzMessageService);
  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate() {
    let storage = this.storageService.getFromStorage(USER_STORAGE_KEY);
    if (
      storage.token === undefined ||
      storage.token === '' ||
      storage.token === null ||
      storage.user.type === USER_TYPES.CUSTOMER
    ) {
      this._toastService.error(
        'Sorry, you are not authorized to access this route. '
      );
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
