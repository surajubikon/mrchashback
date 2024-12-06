import { Component, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { USER_STORAGE_KEY } from 'src/app/core/constant/app.constant';
import { MissingCashbacks } from 'src/app/core/model/missing_cashback';
import { Payment } from 'src/app/core/model/payment-request.model';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-missing-cashback',
  templateUrl: './missing-cashback.component.html',
  styleUrls: ['./missing-cashback.component.scss'],
})
export class MissingCashbackComponent {
  private _userService = inject(UserService);
  private _toastService = inject(NzMessageService);
  private _storageService = inject(StorageService);
  requests: MissingCashbacks[] = [];
  status: string = 'UNPAID';
  userId!: string;
  ngOnInit() {
    this.userId =
      this._storageService.getFromStorage(USER_STORAGE_KEY).user._id;

    this.fetchRequests();
  }
  fetchRequests() {
    this._userService
      .fetchMissingCashbacks({
        customerId: this.userId,
      })
      .subscribe({
        next: (res) => {
          this.requests = res.result.data;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
}
