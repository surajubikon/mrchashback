import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { USER_STORAGE_KEY } from 'src/app/core/constant/app.constant';
import { OthersService } from 'src/app/core/service/others.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  isDataLoad: boolean = false;
  listOfData$!: Observable<any>;
  visible = false;
  isChangePasswordMode: boolean = false;
  changePasswordFormGroup!: FormGroup;
  changeMasterSettingFormGroup!: FormGroup;
  masterSettings: any = {};
  options = ['Commission Setting', 'Password'];
  user: any = {};

  constructor(
    private fb: FormBuilder,
    private _storageService: StorageService,
    private modal: NzModalService
  ) {}
  async ngOnInit(): Promise<void> {
    this.buildUserForm();
    this.onGetMasterSetting();
    this.user = await this._storageService.getFromStorage(USER_STORAGE_KEY)
      .user;
    if (Object.keys(this.user)) {
      this.changePasswordFormGroup.patchValue({
        mobile: this.user.userName,
      });
    }
  }

  buildUserForm() {
    this.changePasswordFormGroup = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: new FormControl(null, [Validators.required]),
    });
    this.changeMasterSettingFormGroup = this.fb.group({
      customerComissionPercent: ['', [Validators.required]],
      referralComissionPercent: ['', [Validators.required]],
    });
  }

  openCreateDrawer() {
    this.open();
  }

  open(): void {
    this.visible = true;
    this.buildUserForm();
  }

  onGetMasterSetting() {
    this._otherService.fetchMasterSettings().subscribe({
      next: (res) => {
        console.log(res);

        this.masterSettings = res.result.data[0];
        this.changeMasterSettingFormGroup.patchValue({
          customerComissionPercent:
            this.masterSettings.customerComissionPercent,
          referralComissionPercent:
            this.masterSettings.referralComissionPercent,
        });
      },
    });
  }

  submitCreateForm() {
    if (this.changePasswordFormGroup.valid && this.isChangePasswordMode) {
      if (
        this.changePasswordFormGroup.value.password !==
        this.changePasswordFormGroup.value.confirmPassword
      ) {
        this._toastService.error('The password and confirmation do not match');
        return;
      }
      this._otherService
        .changePasswordSetting(this.changePasswordFormGroup.value)
        .subscribe({
          next: (res) => {
            this.changePasswordFormGroup.reset();
            this._toastService.success('Password Updated Successfully');
          },
          error: (err) => {
            this._toastService.error(err);
          },
        });
    } else if (
      this.changeMasterSettingFormGroup.valid &&
      !this.isChangePasswordMode
    ) {
      this._otherService
        .updateMasterSettings(
          this.masterSettings._id,
          this.changeMasterSettingFormGroup.value
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            this._toastService.success('Master Settings Updated Successfully');
            this.changeMasterSettingFormGroup.patchValue(res);
          },
          error: (err) => {
            this._toastService.error(err);
          },
        });
    } else {
      this._toastService.error('Form not Valid!');
      if (
        this.changeMasterSettingFormGroup.valid &&
        !this.isChangePasswordMode
      ) {
        Object.values(this.changeMasterSettingFormGroup.controls).forEach(
          (control) => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          }
        );
      } else if (
        this.changePasswordFormGroup.valid &&
        this.isChangePasswordMode
      ) {
        Object.values(this.changePasswordFormGroup.controls).forEach(
          (control) => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          }
        );
      }
    }
  }

  handleSegmentChange(e: number): void {
    console.log(e);
    if (e === 0) {
      this.isChangePasswordMode = false;
    } else if (e === 1) {
      this.isChangePasswordMode = true;
    }
  }
  onChangePassword() {}
}
