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
import { LIMIT_LARGE, USER_TYPE } from 'src/app/core/constant/app.constant';
import { CustomerListInterface } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { UserService } from 'src/app/core/service/user.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent {
  private _toastService = inject(NzMessageService);
  private _userService = inject(UserService);

  listOfData$!: Observable<any>;
  isDataLoad: boolean = false;
  visible = false;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  customerFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  status: string | any = '';
  listOfOption$!: Observable<any>;
  listOfSelectedValue: string[] = [];
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;
  customers: CustomerListInterface[] = [];

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.onGetCustomer();
    this.onSearch();
    // this.onGetListOfOption();
  }

  buildUserForm() {
    this.customerFG = this.fb.group({
      parentId: [null],
      name: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetCustomer();
        })
      )
      .subscribe();
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    if (this.searchText) {
      this.searchFormControl.reset();
      this.status = null;
      this.onGetCustomer();
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
    this.customerFG.reset();
    this.listOfSelectedValue = [];
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetCustomer();
  }
  onGetCustomer() {
    this.isDataLoad = true;
    this._userService
      .fetchUser({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        type: USER_TYPE[1],
        ...(this.searchText && { searchText: this.searchText }),
      })
      .subscribe({
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
  // onGetListOfOption() {
  //   this.listOfOption$ = this._otherService.fetchWebsite();
  // }
  applyStatusFilter(status: string) {
    if (status !== 'ALL') {
      this.status = status;
    } else {
      this.status = null;
    }
    this.onGetCustomer();
  }
  submitCreateForm() {
    if (this.customerFG.valid) {
      const formData = new FormData();
    } else {
      this._toastService.error('AGGREGATES_FORM_MSG');
      Object.values(this.customerFG.controls).forEach((control) => {
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

  onUpdate(formData: any) {}
  onDelete(masterId: string) {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Delete Confirmation',
      nzContent: `Are you sure you want to Delete? The Aggregates is linked at,`,
      nzOnOk: async () => {
        // try {
        //   await new Promise((resolve) => setTimeout(resolve, 1000));
        //   this._otherService
        //     .deleteAggregates(masterId, { isConfirmed: true })
        //     .subscribe({
        //       next: (res: ContentGroupCreateResponse) => {
        //         this._toastService.success(AGGREGATES_DELETE_MSG);
        //         this.onGetCustomer();
        //       },
        //       error: (err) => {
        //         this._toastService.error(err);
        //       },
        //     });
        // } catch (error) {
        //   console.error('Oops errors!', error);
        // }
      },
    });
  }
  onAssociate(content: any) {}

  handleCancelMiddle(): void {}
  onUpdateRelation(data: any) {}
  getFileDetail(event: NzUploadChangeParam, type: string) {
    const fileList = event.fileList;
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj as File; // Extracting the file object
      const reader = new FileReader();
      reader.onload = () => {
        this.mediaImagePreview = reader.result as string; // Setting the preview image
        this.mediaFile = file; // Storing the uploaded file
      };
      reader.readAsDataURL(file); // Read the file as data URL to show preview
    }
  }
  onClearMedia() {
    this.mediaFile = {} as File;
    this.mediaImagePreview = false;
  }
}
