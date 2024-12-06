import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';
import {
  ReferralInterface,
  ReferralReportInterface,
} from 'src/app/core/model/referral.model';
import { CustomerListInterface } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-referral-earnings-report',
  templateUrl: './referral-earnings-report.component.html',
  styleUrls: ['./referral-earnings-report.component.scss'],
})
export class ReferralEarningsReportComponent {
  private _otherService = inject(OthersService);
  private _toastService = inject(NzMessageService);
  private _userService = inject(UserService);

  referral: ReferralReportInterface[] = [];
  searchFormControl = new FormControl(null);
  searchText: string | any = '';
  startDate: string | any;
  endDate: string | any;
  status: any;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  userId!: string;
  referredUserId!: string;

  referralEarningFG!: FormGroup;
  isDataLoad: boolean = false;
  date = null;
  customers: CustomerListInterface[] = [];
  listOfTagOptions: any;
  referralListOfTagOptions: any;

  selectedReferral: ReferralInterface = {} as ReferralInterface;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}
  ngOnInit() {
    this.fetch();
    this.onGetCustomer();
  }

  onChangePage(ev: any) {
    this.page = ev;
    this.fetch();
  }
  onGetCustomer() {
    this.isDataLoad = true;
    this._userService.fetchUser().subscribe({
      next: (res) => {
        this.customers = res.result.users;
        this.totalCounts = res.result.totalCounts;

        this.isDataLoad = false;
      },
      error: (err) => {
        this.isDataLoad = false;
        this._toastService.error(err);
      },
    });
  }
  fetch() {
    this._otherService
      .fetchReferral({
        ...(this.userId && {
          customerId: this.userId,
        }),
        ...(this.referredUserId && {
          referredBy: this.referredUserId,
        }),
      })
      .subscribe({
        next: (res) => {
          this.totalCounts = res.result.totalCounts;
          this.referral = res.result;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }

  onResetFilter() {
    (this.userId = ''), (this.referredUserId = '');
    this.listOfTagOptions = null;
    this.referralListOfTagOptions = null;
    this.fetch();
  }
  applyUserFilter(userId: any) {
    this.userId = userId;
    this.fetch();
  }
  applyReferredFilter(userId: any) {
    this.referredUserId = userId;
    this.fetch();
  }
}
