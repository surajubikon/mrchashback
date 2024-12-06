import { Component, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { USER_STORAGE_KEY } from 'src/app/core/constant/app.constant';
import { Payment } from 'src/app/core/model/payment-request.model';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-my-payment-requests',
  templateUrl: './my-payment-requests.component.html',
  styleUrls: ['./my-payment-requests.component.scss'],
})
export class MyPaymentRequestsComponent {
  private _userService = inject(UserService);
  private _toastService = inject(NzMessageService);
  private _storageService = inject(StorageService);
  requests: Payment[] = [];
  status: string = 'UNPAID';
  userId!: string;
  ngOnInit() {
    this.userId =
      this._storageService.getFromStorage(USER_STORAGE_KEY).user._id;

    this.fetchRequests();
  }
  onChangeStatus(status: string) {
    this.status = status;
    this.fetchRequests();
  }
  fetchRequests() {
    this._userService
      .fetchRequests({
        status: this.status,
        ...(this.userId && { userId: this.userId }),
      })

      .subscribe({
        next: (res) => {
          this.requests = res.result.requests;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
}
