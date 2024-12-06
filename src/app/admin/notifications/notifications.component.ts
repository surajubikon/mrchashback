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
import { DELETE_NOTIFICATIONS_API } from 'src/app/core/constant/api.constant';
import { NotificationInteface } from 'src/app/core/model/notification.model';
import { OthersService } from 'src/app/core/service/others.service';
import { UserService } from 'src/app/core/service/user.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  private _toastService = inject(NzMessageService);
  private _userService = inject(UserService);
  private _otherService = inject(OthersService);

  isDataLoad: boolean = false;
  visible = false;
  notificationFG!: FormGroup;
  isEditMode: boolean = false;
  selectedId: string | any = '';
  searchFormControl = new FormControl(null);
  confirmModal?: NzModalRef;
  imageBaseUrl = environment.media_url;
  isMediaImagePreview: any;
  mediaImagePreview: any;
  public mediaFile: File = {} as File;

  allNotifications: NotificationInteface[] = [];

  constructor(private fb: FormBuilder, private modal: NzModalService) {}

  ngOnInit(): void {
    this.buildForm();
    this.onGetNotification();
  }

  buildForm() {
    this.notificationFG = this.fb.group({
      title: new FormControl(null, [Validators.required]),
      body: new FormControl(null, [Validators.required]),
    });
  }

  openCreateDrawer() {
    this.open();
  }
  onResetFilter() {
    this.onGetNotification();
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedId = null;
    }
    this.notificationFG.reset();
    this.visible = false;
    this.onClearMedia();
  }

  onGetNotification() {
    this.isDataLoad = true;
    this._userService
      .fetchNotifications()

      .subscribe({
        next: (res) => {
          this.allNotifications = res.result.notification;
          this.isDataLoad = false;
        },
        error: (err) => {
          this._toastService.error(err);
          this.isDataLoad = false;
        },
      });
  }

  submitCreateForm() {
    if (this.notificationFG.valid) {
      let formData = new FormData();
      formData.append('title', this.notificationFG.value.title),
        formData.append('body', this.notificationFG.value.body);
      if (Object.keys(this.mediaFile).length > 0) {
        formData.append('file', this.mediaFile);
      }
      this._userService.sendNotification(formData).subscribe({
        next: (res) => {
          this.onGetNotification();
          this._toastService.success('Created Successfully');
          this.close();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Form Not Valid!');
      Object.values(this.notificationFG.controls).forEach((control) => {
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

  onDelete(itemId: string) {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Delete Confirmation',
      nzContent: `Are you sure you want to Delete? `,
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._otherService
            .delete(itemId, DELETE_NOTIFICATIONS_API)
            .subscribe({
              next: (res) => {
                this._toastService.success('Successfully deleted ');
                this.onGetNotification();
                this.close();
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
