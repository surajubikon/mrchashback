import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  private _storageService = inject(StorageService);
  private _router = inject(Router);
  confirmModal?: NzModalRef;
  constructor(private modal: NzModalService) {}
  onLogOut() {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Logout Confirmation',
      nzContent: 'Are you sure you want to logout?',
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._storageService.clearAllStorage();
          await this._router.navigateByUrl('/login', { replaceUrl: true });
        } catch (error) {
          console.error('Oops errors!', error);
        }
      },
    });
  }
}
