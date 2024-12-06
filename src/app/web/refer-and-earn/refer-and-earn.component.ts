import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  ReferralInterface,
  ReferralReportInterface,
} from 'src/app/core/model/referral.model';
import { User } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss'],
})
export class ReferAndEarnComponent implements OnInit {
  list: ReferralReportInterface[] = [];
  userData: User = {} as User;
  copySuccess: boolean = false;
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    // this.onGet();
    this.onGetReferral();
    this.fetchUser();
  }
  fetchUser() {
    this._userService.fetchProfile().subscribe({
      next: (res) => {
        this.userData = res.result.user[0];
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }
  copyToClipboard() {
    let text =
      'https://mrcashback.in/invite/' + this.userData?.referralCode;
      // 'http://localhost:4200/invite/' + this.userData?.referralCode
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const success = document.execCommand('copy');
    document.body.removeChild(input);
    if (success) {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 5000); // Hide the message after 2 seconds
    }
  }

  async onGet() {
    this._otherService.fetchReferralTransaction().subscribe({
      next: (res) => {
        this.list = res.result.data;
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  async onGetReferral() {
    this._otherService.fetchReferral().subscribe({
      next: (res) => {
        this.list = res.result;
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
}
