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
import { saveExcelFile } from 'src/app/core/service/user.service';
import { environment } from 'src/app/environments/environment.prod';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-closed-orders',
  templateUrl: './closed-orders.component.html',
  styleUrls: ['./closed-orders.component.scss'],
})
export class ClosedOrdersComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  leads: Leads[] = [];
  date = null;
  listOfTagOptions: any;
  isDataLoad: boolean = false;
  visible = false;
  closeOrderFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  startDate: string | any;
  endDate: string | any;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.onGetLeads();
    this.onSearch();
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
        status: 'CLOSED',
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
    if (this.closeOrderFG.valid) {
      const formData = new FormData();
    } else {
      this._toastService.error('website_FORM_MSG');
      Object.values(this.closeOrderFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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

  exportToExcel(data: any[], filename: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveExcelFile(excelBuffer, filename);
  }
}
