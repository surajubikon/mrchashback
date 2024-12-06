import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-missing-cashback',
  templateUrl: './missing-cashback.component.html',
  styleUrls: ['./missing-cashback.component.scss'],
})
export class MissingCashbackAdminComponent {
  private _userService = inject(UserService);
  private _toastService = inject(NzMessageService);
  private _storageService = inject(StorageService);
  requests: MissingCashbacks[] = [];
  searchFormControl = new FormControl(null);
  searchText: string | any = '';
  startDate: string | any;
  endDate: string | any;
  status: any;
  userId!: string;
  visible = false;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  missingCashbackFG!: FormGroup;
  isDataLoad: boolean = false;
  date = null;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  listOfTagOptions: any;
  selectedRequest: MissingCashbacks = {} as MissingCashbacks;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}
  ngOnInit() {
    this.userId =
      this._storageService.getFromStorage(USER_STORAGE_KEY).user._id;

    this.fetch();
    this.onSearch();
  }
  buildUserForm() {
    this.missingCashbackFG = this.fb.group({
      status: ['', Validators.required],
      adminComment: ['', Validators.required],
    });
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
  fetch() {
    this._userService
      .fetchMissingCashbacks({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.searchText && { searchText: this.searchText }),
        ...(this.startDate && {
          startDate: this.startDate,
        }),
        ...(this.endDate && {
          endDate: this.endDate,
        }),
        ...(this.status && {
          status: this.status,
        }),
      })
      .subscribe({
        next: (res) => {
          this.requests = res.result.data;
          this.totalCounts = res.result.totalCounts;
          console.log(res.result.totalCounts);
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    if (this.startDate || this.endDate || this.searchText || this.status) {
      this.searchFormControl.reset();
      this.startDate = null;
      this.endDate = null;
      this.date = null;
      this.status = null;
      this.listOfTagOptions = null;
      this.fetch();
    }
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.fetch();
  }
  open(): void {
    this.visible = true;
    this.buildUserForm();
  }
  applyStatusFilter(status: string) {
    this.status = status;
    this.fetch();
  }
  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
      this.selectedRequest = {} as MissingCashbacks;
    }
    this.missingCashbackFG.reset();
    this.visible = false;
  }
  onEditForm(content: MissingCashbacks) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
    this.selectedRequest = content;
    this.missingCashbackFG.patchValue({
      status: content.status,
      adminComment: content.adminComment,
    });
  }

  onUpdate() {
    if (this.missingCashbackFG.valid) {
      this._userService
        .updateMissingCashbacks(this.selectedId, this.missingCashbackFG.value)
        .subscribe({
          next: (res) => {
            this._toastService.success('Ticket Status Updated Successfully');
            this.close();
            this.fetch();
          },
          error: (err) => {
            this._toastService.error(err);
          },
        });
    } else {
      this._toastService.error('Form Not Valid!');
      Object.values(this.missingCashbackFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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
