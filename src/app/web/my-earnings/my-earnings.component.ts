import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { USER_STORAGE_KEY } from 'src/app/core/constant/app.constant';
import { Leads } from 'src/app/core/model/leads.model';
import { MissingCashbacks } from 'src/app/core/model/missing_cashback';
import { WalletInterface } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss'],
})
export class MyEarningsComponent implements OnInit {
  private _toastService = inject(NzMessageService);
  wallet: WalletInterface = {} as WalletInterface;
  transactions: Trasnsactoins[] = [];

  confirmModal?: NzModalRef;
  leads: Leads[] = [];
  isVisible = false;
  isWithdrawalModal: boolean = false;
  isOkLoading = false;
  selelctedLeads: Leads = {} as Leads;
  customerCommentFC = new FormControl();
  list: MissingCashbacks = {} as MissingCashbacks;
  withdrawalAmountFormControl = new FormControl(null);
  user: any = {};
  constructor(
    private _userService: UserService,
    private _storageService: StorageService,
    private _otherService: OthersService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    this.fetchWallet();
    this.fetchTransactions();
    this.fetchLeads();
    this.user = this._storageService.getFromStorage(USER_STORAGE_KEY);
  }
  fetchWallet() {
    this._userService.fetchWallet().subscribe({
      next: (res) => {
        this.wallet = res.result.wallet[0];
        console.log('Wallet = ', this.wallet);
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  fetchTransactions() {
    this._userService.fetchTransactions().subscribe({
      next: (res) => {
        this.transactions = res.result.requests;
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  async fetchLeads() {
    this._otherService.fetchLeads().subscribe({
      next: (res) => {
        this.leads = res.result.leads;
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }

  onSelect(lead: Leads) {
    this.list = {} as MissingCashbacks;
    this.selelctedLeads = lead;
    this.onGet(lead._id);
    this.showModal();
  }
  async onGet(SeletedLeadId: string) {
    this._userService
      .fetchMissingCashbacks({
        ...(SeletedLeadId && { leadID: SeletedLeadId.split('T')[0] }),
      })
      .subscribe({
        next: (res) => {
          this.list = res.result.data[0];
          this.customerCommentFC.patchValue(this.list?.customerComment);
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.list.customerComment) {
      this._toastService.success('Request Already Exists');
      return;
    }
    if (
      typeof this.customerCommentFC.value === 'string' &&
      this.customerCommentFC.valid
    ) {
      this.isOkLoading = true;
      let userForm = {
        leadID: this.selelctedLeads._id,
        status: 'PENDING', //PENDING,INPROGRESS,COMPLETED
        customerComment: this.customerCommentFC.value, //opt
      };
      this._userService.createMissingCashbacksRequest(userForm).subscribe({
        next: (res) => {
          this._toastService.success('Request Created Successfully');
          setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
          }, 3000);
          this.selelctedLeads = {} as Leads;
        },
        error: (err) => {
          this._toastService.error(err);
          this.isOkLoading = false;
        },
      });
    } else {
      this.customerCommentFC.markAsDirty();
      this.customerCommentFC.updateValueAndValidity({ onlySelf: true });
      this._toastService.error('Comment is not valid!');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selelctedLeads = {} as Leads;
    this.list = {} as MissingCashbacks;
  }
  async openRequestModal(amount: number) {
    if (amount < 150) {
      this._toastService.error(
        'You need at least ₹150 to send a withdrawal request. Shop more to earn more!'
      );
      return;
    }
    this.isWithdrawalModal = true;
  }
  onSendRequest() {
    if (!this.withdrawalAmountFormControl.value) {
      this._toastService.error('All field are required!');
      return;
    }
    let userData = {
      status: 'UNPAID',
      userId: this.user.user._id,
      amount: this.withdrawalAmountFormControl.value,
    };

    this._userService
      .createRequest(userData)

      .subscribe({
        next: (res) => {
          this._toastService.success('Request Send Successfully!');
          this.onCloseWithdrawalModal();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
  onCloseWithdrawalModal() {
    this.withdrawalAmountFormControl.reset();
    this.isWithdrawalModal = false;
  }
}

export interface Trasnsactoins {
  _id: string;
  userId: string;
  amount: number;
  type: string;
  paymentMode: string;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
}
