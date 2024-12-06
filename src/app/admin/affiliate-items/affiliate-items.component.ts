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
import { AffiliateItemInterface } from 'src/app/core/model/affiliate.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';
import { CategoriesInterface } from '../../core/model/categories.model';
import { DELETE_AFFILIATE_ITEM_API } from 'src/app/core/constant/api.constant';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';

@Component({
  selector: 'app-affiliate-items',
  templateUrl: './affiliate-items.component.html',
  styleUrls: ['./affiliate-items.component.scss'],
})
export class AffiliateItemsComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  affiliateItems: AffiliateItemInterface[] = [];
  listOfTagOptions: any;
  categories: CategoriesInterface[] = [];
  websiteData: WebsiteInterface[] = [];
  isDataLoad: boolean = false;
  visible = false;
  affiliateItemFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  searchText: string | any = '';
  categoryId: string | any = '';
  imageBaseUrl = environment.media_url;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildForm();
    this.onGetAffiliateItems();
    this.onSearch();
    this.onGetWebsite();
    this.onGetListOfCategory();
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetAffiliateItems();
  }
  buildForm() {
    this.affiliateItemFG = this.fb.group({
      url: new FormControl('', [Validators.required]),
      dealHeadline: new FormControl(null, [Validators.required]),
      imageUrl: new FormControl(null, [Validators.required]),
      orignalPrice: new FormControl(null, [Validators.required]),
      actualPrice: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      brandLogoUrl: new FormControl(null, [Validators.required]),
      cashback: new FormControl(null, [Validators.required]),
      dealType: new FormControl(null, [Validators.required]),
      dealTimer: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      websiteId: new FormControl(null, [Validators.required]),
      type: new FormControl('PRODUCT', [Validators.required]),
      categoryId: new FormControl(null, [Validators.required]),
    });
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetAffiliateItems();
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
    this.onGetAffiliateItems();
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
    }
    this.affiliateItemFG.reset();

    this.visible = false;
  }

  onGetAffiliateItems() {
    this.isDataLoad = true;
    this._otherService
      .fetchAffiliateItems({
        type: 'PRODUCT',
        ...(!this.searchText && { page: this.page }),
        ...(!this.searchText && { limit: this.limit }),
        ...(this.searchText && { name: this.searchText }),
        ...(this.categoryId && {
          categoryId: this.categoryId,
        }),
      })
      .subscribe({
        next: (res) => {
          this.affiliateItems = res.result.affiliateItems;
          this.totalCounts = res.result.totalCounts;

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
        type: 'PRODUCT',
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
  onGetWebsite() {
    this._otherService
      .fetchWebsite({
        type: 'PRODUCT',
      })
      .subscribe({
        next: (res) => {
          this.websiteData = res.websites;
        },
        error: (error) => {
          this._toastService.error(error);
        },
      });
  }
  applyCategoryFilter(categoryId: any) {
    this.categoryId = categoryId;
    this.onGetAffiliateItems();
  }
  submitCreateForm() {
    if (this.affiliateItemFG.valid) {
      if (this.selectedId) {
        this.onUpdate();
        return;
      }
      this._otherService
        .createAffiliateItems(this.affiliateItemFG.value)
        .subscribe({
          next: (res) => {
            this.onGetAffiliateItems();
            this._toastService.success('Created Successfully');
            this.close();
          },
          error: (err) => {
            this._toastService.error(err);
          },
        });
    } else {
      this._toastService.error('Form Not valid!');
      Object.values(this.affiliateItemFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onEditForm(content: AffiliateItemInterface) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
    this.affiliateItemFG.patchValue(content);
    this.affiliateItemFG.patchValue({
      websiteId: content.websiteId._id,
      categoryId: content.categoryId._id,
    });
  }

  onUpdate() {
    this._otherService
      .updateAffiliateItems(this.affiliateItemFG.value, this.selectedId)
      .subscribe({
        next: (res) => {
          this.onGetAffiliateItems();
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
          this._otherService
            .delete(itemId, DELETE_AFFILIATE_ITEM_API)
            .subscribe({
              next: (res) => {
                this._toastService.success('Successfully deleted ');
                this.onGetAffiliateItems();
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
}
