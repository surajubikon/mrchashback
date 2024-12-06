import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import {
  LIMIT_LARGE,
  USER_STORAGE_KEY,
} from 'src/app/core/constant/app.constant';
import { MissingCashbacks } from 'src/app/core/model/missing_cashback';
import { ReferralInterface } from 'src/app/core/model/referral.model';
import { User } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-referral-earnings',
  templateUrl: './referral-earnings.component.html',
  styleUrls: ['./referral-earnings.component.scss'],
})
export class ReferralEarningsComponent {
  private _otherService = inject(OthersService);
  private _toastService = inject(NzMessageService);
  referral: ReferralInterface[] = [];
  searchFormControl = new FormControl(null);
  searchText: string | any = '';
  startDate: string | any;
  endDate: string | any;
  status: any;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  userId!: string;
  referralEarningFG!: FormGroup;
  isDataLoad: boolean = false;
  date = null;
  listOfTagOptions: any;
  selectedReferral: ReferralInterface = {} as ReferralInterface;
  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private modal: NzModalService
  ) {}
  ngOnInit() {
    this.fetch();
    this.onSearch();
  }

  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.fetch();
        })
      )
      .subscribe();
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.fetch();
  }
  fetch() {
    this._otherService
      .fetchReferralTransaction({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.searchText && { searchText: this.searchText }),
        ...(this.startDate && {
          startDate: this.startDate,
        }),
        ...(this.endDate && {
          endDate: this.endDate,
        }),
      })
      .subscribe({
        next: (res) => {
          this.totalCounts = res.result.totalCounts;
          this.referral = res.result.data;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }

  onResetFilter() {
    if (this.startDate || this.endDate || this.searchText) {
      this.searchFormControl.reset();
      this.startDate = null;
      this.endDate = null;
      this.date = null;
      this.listOfTagOptions = null;
      this.fetch();
    }
  }

  applyStatusFilter(status: string) {
    this.status = status;
    this.fetch();
  }

  onChangeDate(result: any): void {
    const selectedDates = result.map((dateString: any) =>
      this.formatDate(dateString)
    );
    this.startDate = selectedDates[0];
    this.endDate = selectedDates[1];
    this.fetch();
  }
  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }
}
