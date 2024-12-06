import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';
import { Payment } from 'src/app/core/model/payment-request.model';
import { OthersService } from 'src/app/core/service/others.service';
import { UserService } from 'src/app/core/service/user.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.scss'],
})
export class PaymentRequestsComponent {
  private _toastService = inject(NzMessageService);
  private _userService = inject(UserService);
  requests: Payment[] = [];
  isDataLoad: boolean = false;
  visible = false;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  requestFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  // status: string | any = '';
  listOfOption$!: Observable<any>;
  listOfSelectedValue: string[] = [];
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;
  status: string = 'UNPAID';
  isVisible = false;
  options = ['Active Requests', 'Past Requests'];
  paymentModeFormControl = new FormControl(null);
  selectedRequest: Payment = {} as Payment;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.onSearch();
    this.onGetRequest();
  }

  buildUserForm() {
    this.requestFG = this.fb.group({
      parentId: [null],
      name: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetRequest();
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetRequest();
        })
      )
      .subscribe();
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    if (this.status || this.searchText) {
      this.searchFormControl.reset();
    } else if (this.status) {
      this.onGetRequest();
    }
  }
  open(): void {
    this.visible = true;
    this.buildUserForm();
  }

  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
    }
    this.requestFG.reset();
    this.listOfSelectedValue = [];
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  handleSegmentChange(e: number): void {
    if (e === 0) {
      this.status = 'UNPAID';
    } else if (e === 1) {
      this.status = 'PAID';
    }
    this.searchFormControl.reset();
    this.onGetRequest();
  }
  onGetRequest() {
    this.isDataLoad = true;
    this._userService
      .fetchRequests({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.status && { status: this.status }),
        ...(this.searchText && { searchText: this.searchText }),
      })
      .subscribe({
        next: (res) => {
          this.requests = res.result.requests;
          this.totalCounts = res.result.totalCounts;
          this.isDataLoad = false;
        },
        error: (err) => {
          this.isDataLoad = false;
          this._toastService.error(err);
        },
      });
  }

  applyStatusFilter(status: string) {
    if (status !== 'ALL') {
      this.status = status;
    } else {
    }
    this.onGetRequest();
  }
  submitCreateForm() {
    if (this.requestFG.valid) {
      const formData = new FormData();
    } else {
      this._toastService.error('AGGREGATES_FORM_MSG');
      Object.values(this.requestFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onEditForm(content: any) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
  }
  openRequestUpdate(payment: Payment): void {
    this.isVisible = true;
    this.selectedRequest = payment;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selectedRequest = {} as Payment;
    this.paymentModeFormControl.reset();
  }

  onUpdateRequest() {
    if (!this.paymentModeFormControl.value) {
      this._toastService.error('Please Select Payment Mode');
      return;
    }
    this._userService
      .updateRequest(this.selectedRequest._id, {
        status: 'PAID',
        amount: this.selectedRequest.amount,
        userId: this.selectedRequest.userId._id,
        paymentMode: this.paymentModeFormControl.value,
      })
      .subscribe({
        next: (res) => {
          this._toastService.success('Updated Successfully');
          this.isVisible = false;
          this.selectedRequest = {} as Payment;
          this.paymentModeFormControl.reset();

          this.onGetRequest();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
}
