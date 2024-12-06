import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import {
  DELETE_CATEGORY_API,
  DELETE_WEBSITE_API,
} from 'src/app/core/constant/api.constant';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss'],
})
export class WebsitesComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  websiteData: WebsiteInterface[] = [];
  categories: CategoriesInterface[] = [];
  listOfTagOptions: any;
  isDataLoad: boolean = false;
  visible = false;
  websiteFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  categoryId: string | any = '';
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  public mediaFile: File = {} as File;
  isVisible = false;
  numbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedNumber!: number | null;

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildWebsiteForm();
    this.onGetWebsite();
    this.onSearch();
    this.onGetListOfCategory();
  }

  buildWebsiteForm() {
    this.websiteFG = this.fb.group({
      name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      isVisible: new FormControl(true, [Validators.required]),
      companyId: new FormControl(null, [Validators.required]),
      categoryId: new FormControl(null, [Validators.required]),
      maximumCashback: new FormControl(null),
      trackingTime: new FormControl(null),
      allotmentTime: new FormControl(null),
      termsAndConditions: this.fb.array([
        this.fb.group({
          sectionTitle: new FormControl(null),
          terms: this.fb.array([new FormControl('')]),
        }),
      ]),
    });
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetWebsite();
        })
      )
      .subscribe();
  }
  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    if (this.categoryId || this.searchText) {
      this.searchFormControl.reset();
      this.listOfTagOptions = null;
      this.categoryId = null;
    } else if (this.categoryId) {
      this.categoryId = null;
      this.listOfTagOptions = null;
    }
    this.onGetWebsite();
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
    }
    this.websiteFG.reset();
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetWebsite();
  }
  onGetWebsite() {
    this.isDataLoad = true;
    this._otherService
      .fetchWebsite({
        type: 'WEBSITE',
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.searchText && { searchText: this.searchText }),
        ...(this.categoryId && {
          categoryId: this.categoryId,
        }),
      })
      .subscribe({
        next: (res) => {
          this.websiteData = res.websites;
          this.totalCounts = res.totalCounts;
          this.isDataLoad = false;
        },
        error: (error) => {
          this._toastService.error(error);
          this.isDataLoad = false;
        },
      });
  }
  onGetListOfCategory() {
    this._otherService
      .fetchCategories({
        type: 'WEBSITE',
      })
      .subscribe({
        next: (res) => {
          this.categories = res.result.categories;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
  applyCategoryFilter(categoryId: any) {
    this.categoryId = categoryId;
    this.onGetWebsite();
  }
  termsAndConditionValidation(): boolean {
    let res: boolean = false;
    this.websiteFG.value.termsAndConditions.forEach((element: any) => {
      if (element.sectionTitle === null) {
        res = false;
      } else {
        res = true;
      }
    });
    return res;
  }
  get termsAndConditionsFormArray(): FormArray {
    return this.websiteFG.get('termsAndConditions') as FormArray;
  }

  addSection() {
    const termsAndConditionsArray = this.websiteFG.get(
      'termsAndConditions'
    ) as FormArray;
    termsAndConditionsArray.push(
      this.fb.group({
        sectionTitle: new FormControl(null),
        terms: this.fb.array([new FormControl(null)]),
      })
    );
  }

  addTerm(sectionIndex: number) {
    const termsArray = (this.websiteFG.get('termsAndConditions') as FormArray)
      .at(sectionIndex)
      .get('terms') as FormArray;
    termsArray.push(this.fb.control(''));
  }

  removeSection(sectionIndex: number) {
    const termsAndConditionsArray = this.websiteFG.get(
      'termsAndConditions'
    ) as FormArray;
    termsAndConditionsArray.removeAt(sectionIndex);
  }

  getTermsArray(section: AbstractControl): FormArray {
    return (section as FormGroup).get('terms') as FormArray;
  }
  removeTerm(sectionIndex: number, termIndex: number) {
    const termsArray = (this.websiteFG.get('termsAndConditions') as FormArray)
      .at(sectionIndex)
      .get('terms') as FormArray;
    termsArray.removeAt(termIndex);
  }
  clearTermsAndConditionsFormArray() {
    while (this.termsAndConditionsFormArray.length !== 0) {
      this.termsAndConditionsFormArray.removeAt(0);
    }
  }
  submitCreateForm() {
    if (this.websiteFG.valid) {
      const formData = new FormData();
      formData.append('name', this.websiteFG.value.name),
        formData.append('url', this.websiteFG.value.url),
        formData.append('isVisible', this.websiteFG.value.isVisible),
        formData.append('companyId', this.websiteFG.value.companyId);
      formData.append('categoryId', this.websiteFG.value.categoryId);
      formData.append('trackingTime', this.websiteFG.value.trackingTime);
      formData.append('allotmentTime', this.websiteFG.value.allotmentTime);
      if (this.termsAndConditionValidation()) {
        formData.append(
          'termsAndConditions',
          JSON.stringify(this.websiteFG.value.termsAndConditions)
        );
      }
      if (this.websiteFG.value.maximumCashback) {
        formData.append(
          'maximumCashback',
          this.websiteFG.value.maximumCashback
        );
      }
      if (this.mediaImagePreview) {
        formData.append('file', this.mediaFile);
      }
      if (this.selectedId) {
        this.onUpdate(formData);
        return;
      }
      this._otherService.createWebsite(formData).subscribe({
        next: (res) => {
          this.onGetWebsite();
          this._toastService.success('Created Successfully');
          this.close();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Form Not Valid!');
      Object.values(this.websiteFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onEditForm(content: WebsiteInterface) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
    this.initUpdateForm(content);
  }
  initUpdateForm(item: WebsiteInterface) {
    if (item) {
      this.websiteFG.patchValue({
        name: item.name,
        url: item.url,
        isVisible: item.isVisible,
        companyId: item.companyId,
        categoryId: (item.categoryId && item.categoryId._id) || null,
        maximumCashback: item?.maximumCashback,
        allotmentTime: item?.allotmentTime,
        trackingTime: item?.trackingTime,

      });
      if (item?.termsAndConditions?.length > 0) {
        this.clearTermsAndConditionsFormArray();
        item.termsAndConditions.forEach((section: any) => {
          const newSection = this.fb.group({
            sectionTitle: section.sectionTitle,
            terms: this.fb.array([]),
          });

          section.terms.forEach((term: string) => {
            (newSection.get('terms') as FormArray).push(this.fb.control(term));
          });
          this.termsAndConditionsFormArray.push(newSection);
        });
      }
      this.isMediaImagePreview = item.icon;
    }
  }
  onUpdate(formData: any) {
    this._otherService.updateWebsite(formData, this.selectedId).subscribe({
      next: (res) => {
        this.onGetWebsite();
        this.close();
        this._toastService.success('Updated Successfully');
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  onDelete(itemId: string) {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Delete Confirmation',
      nzContent: `Are you sure you want to Delete?`,
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._otherService.delete(itemId, DELETE_WEBSITE_API).subscribe({
            next: (res) => {
              this._toastService.success('Successfully deleted ');
              this.onGetWebsite();
            },
            error: (error) => {
              this._toastService.error(error);
            },
          });
        } catch (error) {
          console.error('Oops errors!', error);
        }
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    (this.selectedId = null), (this.selectedNumber = null);
  }
  onClickSortOrder(item: WebsiteInterface) {
    this.selectedId = item._id;
    if (item?.sortOrder !== -1) {
      this.selectedNumber = item?.sortOrder;
    }
    this.isVisible = true;
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
    this.isMediaImagePreview = null;
  }
  updateOrder() {
    if (!this.selectedNumber) {
      this._toastService.error('Please Select Sort Number');
      return;
    }
    this._otherService
      .updateSortOrder(
        {
          sortOrder: this.selectedNumber,
        },
        this.selectedId
      )
      .subscribe({
        next: (res) => {
          this._toastService.success('Sort Order Updated sucessfully');
          this.handleCancel();
          this.selectedNumber = null;
          this.selectedId = null;
          this.onGetWebsite();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
}
