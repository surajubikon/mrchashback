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
import { Leads } from 'src/app/core/model/leads.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
})
export class OpenOrdersComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  leads: Leads[] = [];
  date = null;
  listOfTagOptions: any;
  isDataLoad: boolean = false;
  visible = false;
  openOrderFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  startDate: string | any;
  endDate: string | any;
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.onGetLeads();
    this.onSearch();
  }

  buildUserForm() {
    this.openOrderFG = this.fb.group({
      parentId: [null],
      name: ['', Validators.required],
      selectedDates: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetLeads();
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetLeads();
        })
      )
      .subscribe();
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    if (this.startDate || this.endDate || this.searchText) {
      this.searchFormControl.reset();
      this.listOfTagOptions = null;
      this.startDate = null;
      this.endDate = null;
      this.date = null;
    }
    this.onGetLeads();
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
    this.openOrderFG.reset();
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  onChangeDate(result: any): void {
    const selectedDates = result.map((dateString: any) =>
      this.formatDate(dateString)
    );
    this.startDate = selectedDates[0];
    this.endDate = selectedDates[1];

    this.onGetLeads();
  }

  onGetLeads() {
    this.isDataLoad = true;
    this._otherService
      .fetchLeads({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        status: 'OPEN',
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
          this.leads = res.result.leads;
          this.totalCounts = res.result.totalCounts;

          this.isDataLoad = false;
        },
        error: (error) => {
          this._toastService.error(error);
          this.isDataLoad = false;
        },
      });
  }
  // onGetListOfCategory() {
  //   this._otherService.fetchCategories().subscribe({
  //     next: (res) => {
  //       this.categories = res.result.categories;
  //     },
  //     error: (err) => {
  //       this._toastService.error(err);
  //     },
  //   });
  // }

  submitCreateForm() {
    if (this.openOrderFG.valid) {
      const formData = new FormData();
    } else {
      this._toastService.error('website_FORM_MSG');
      Object.values(this.openOrderFG.controls).forEach((control) => {
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
      nzContent: `Are you sure you want to Delete? The website is linked at,`,
      nzOnOk: async () => {
        // try {
        //   await new Promise((resolve) => setTimeout(resolve, 1000));
        //   this._otherService
        //     .deletewebsite(masterId, { isConfirmed: true })
        //     .subscribe({
        //       next: (res: ContentGroupCreateResponse) => {
        //         this._toastService.success(website_DELETE_MSG);
        //         this.onGetLeads();
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
  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }
}
