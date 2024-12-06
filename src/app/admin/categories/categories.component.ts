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
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { DELETE_CATEGORY_API } from 'src/app/core/constant/api.constant';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  categories: CategoriesInterface[] = [];
  isDataLoad: boolean = false;
  visible = false;
  categoriesFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;
  type: string = 'WEBSITE';

  options = [
    'Store (Website) Categories',
    'Deals (Affiliate Items) Categories',
  ];

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildForm();
    this.onSearch();
    this.onGetListOfCategory();
  }

  buildForm() {
    this.categoriesFG = this.fb.group({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
    });
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetListOfCategory();
        })
      )
      .subscribe();
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    this.searchFormControl.reset();
  }
  open(): void {
    this.visible = true;
    this.buildForm();
  }

  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
    }
    this.categoriesFG.reset();
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetListOfCategory();
  }
  onGetListOfCategory() {
    this._otherService
      .fetchCategories({
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.type && { type: this.type }),
        ...(this.searchText && { searchText: this.searchText }),
      })
      .subscribe({
        next: (res) => {
          this.categories = res.result.categories;
          this.totalCounts = res.result.totalCounts;
          this.isDataLoad = false;
        },
        error: (err) => {
          this.isDataLoad = false;
          this._toastService.error(err);
        },
      });
  }

  submitCreateForm() {
    if (this.categoriesFG.valid) {
      const formData = new FormData();
      formData.append('name', this.categoriesFG.value.name);
      formData.append('type', this.categoriesFG.value.type);
      if (Object.keys(this.mediaFile).length > 0) {
        formData.append('file', this.mediaFile);
      }
      if (this.isEditMode) {
        this.onUpdate(formData);
        return;
      }
      this._otherService.createCategories(formData).subscribe({
        next: (res) => {
          this._toastService.success('Category Create Sucessfully!');
          this.categoriesFG.reset();
          this.onClearMedia();
          this.onGetListOfCategory();
          this.close();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Form not Valid!');
      Object.values(this.categoriesFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onEditForm(content: CategoriesInterface) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
    this.isMediaImagePreview = content.icon;
    this.categoriesFG.patchValue({
      name: content.name,
      type: content.type,
    });
  }

  onUpdate(formData: any) {
    this._otherService.updateCategories(formData, this.selectedId).subscribe({
      next: (res) => {
        this._toastService.success('Category Updated Sucessfully!');
        this.categoriesFG.reset();
        this.onClearMedia();
        this.onGetListOfCategory();
        this.close();
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  onDelete(itemId: string) {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Delete Confirmation',
      nzContent: `Are you sure you want to Delete?,`,
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._otherService.delete(itemId, DELETE_CATEGORY_API).subscribe({
            next: (res: any) => {
              this._toastService.success('Deleted Successfully');
              this.onGetListOfCategory();
            },
            error: (err) => {
              this._toastService.error(err);
            },
          });
        } catch (error) {
          console.error('Oops errors!', error);
        }
      },
    });
  }

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

  handleSegmentChange(e: number): void {
    if (e === 0) {
      this.type = 'WEBSITE';
    } else if (e === 1) {
      this.type = 'PRODUCT';
    }
    this.searchFormControl.reset();
    this.onGetListOfCategory();
  }
}
