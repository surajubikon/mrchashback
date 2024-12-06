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
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';
import { BannerInterface } from '../../core/model/banner.model';
import { DELETE_BANNER_API } from 'src/app/core/constant/api.constant';
import { LIMIT_LARGE } from 'src/app/core/constant/app.constant';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  banners: BannerInterface[] = [];
  isDataLoad: boolean = false;
  visible = false;
  limit = LIMIT_LARGE;
  page = 1;
  totalCounts = 0;
  bannerFormGroup!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  confirmModal?: NzModalRef;
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildForm();
    this.onGetListOfBanner();
  }

  buildForm() {
    this.bannerFormGroup = this.fb.group({
      redirectUrl: new FormControl('', [Validators.required]),
      isVisible: new FormControl(true, [Validators.required]),
      page: new FormControl('', [Validators.required]),
    });
  }

  openCreateDrawer() {
    this.open();
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
    this.bannerFormGroup.reset();
    this.mediaFile = {} as File;
    this.mediaImagePreview = null;
    this.isMediaImagePreview = null;
    this.visible = false;
  }
  onChangePage(ev: any) {
    this.page = ev;
    this.onGetListOfBanner();
  }
  onGetListOfBanner() {
    this._otherService
      .fetchBanner({
        // page: this.page,
        // limit: this.limit,
      })
      .subscribe({
        next: (res) => {
          this.banners = res.result.banners;
          this.totalCounts = res.result.totalCounts;

        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }

  submitCreateForm() {
    if (this.bannerFormGroup.valid) {
      let formData = new FormData();
      formData.append('redirectUrl', this.bannerFormGroup.value.redirectUrl),
        formData.append('isVisible', this.bannerFormGroup.value.isVisible),
        formData.append('page', this.bannerFormGroup.value.page);
      if (Object.keys(this.mediaFile).length > 0) {
        formData.append('file', this.mediaFile);
      }
      if (this.isEditMode) {
        this.onUpdate(formData);
        return;
      }
      this._otherService.createBanner(formData).subscribe({
        next: (res) => {
          this._toastService.success('Banner Create Sucessfully!');
          this.bannerFormGroup.reset();
          this.onClearMedia();
          this.onGetListOfBanner();
          this.close();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Form Not valid!');
      Object.values(this.bannerFormGroup.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onEditForm(content: BannerInterface) {
    this.open();
    this.isEditMode = true;
    this.selectedId = content._id;
    this.isMediaImagePreview = content.mediaPath;
    this.bannerFormGroup.patchValue({
      redirectUrl: content.redirectUrl,
      isVisible: content.isVisible,
      page: content.page,
    });
  }

  onUpdate(formData: any) {
    this._otherService.updateBanner(formData, this.selectedId).subscribe({
      next: (res) => {
        this._toastService.success('Banner Updated Sucessfully!');
        this.bannerFormGroup.reset();
        this.onClearMedia();
        this.onGetListOfBanner();
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
      nzContent: `Are you sure you want to Delete? ,`,
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._otherService.delete(itemId, DELETE_BANNER_API).subscribe({
            next: (res) => {
              this._toastService.success('Successfully deleted the Banner');
              this.onGetListOfBanner();
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

  getFileDetail(event: NzUploadChangeParam, type: string) {
    const fileList = event.fileList;
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj as File;
      const reader = new FileReader();
      reader.onload = () => {
        this.mediaImagePreview = reader.result as string;
        this.mediaFile = file;
      };
      reader.readAsDataURL(file);
    }
  }
  onClearMedia() {
    this.mediaFile = {} as File;
    this.mediaImagePreview = false;
  }
}
