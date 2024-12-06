import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { USER_STORAGE_KEY } from 'src/app/core/constant/app.constant';
import { User } from 'src/app/core/model/user.model';
import { OthersService } from 'src/app/core/service/others.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.scss'],
})
export class CustomerSettingsComponent {
  isLoading = false;

  fetchUser$!: Observable<any>;
  shortName!: string;
  userData: User = {} as User;
  editMode = false;
  profileFormGroup!: FormGroup;
  changePasswordFormGroup!: FormGroup;
  user: any = {};

  api$!: Observable<any>;
  private _otherService = inject(OthersService);
  private _toastService = inject(NzMessageService);
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _storageService: StorageService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.buildChangePasswordForm();
    this.fetchUser();
    this.user = await this._storageService.getFromStorage(USER_STORAGE_KEY)
      .user;
    if (Object.keys(this.user)) {
      this.changePasswordFormGroup.patchValue({
        mobile: this.user.userName,
      });
    }
  }

  buildForm() {
    this.profileFormGroup = this._formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      bankIFSC: new FormControl(null, []),
      bankAccNum: new FormControl(null, []),
      bankName: new FormControl(null),
      upiId: new FormControl(null),
      paytmNumber: new FormControl(null),
      panCard: new FormControl(null),
    });
  }
  buildChangePasswordForm() {
    this.changePasswordFormGroup = this._formBuilder.group({
      mobile: new FormControl([Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

  fetchUser() {
    this._userService.fetchProfile().subscribe({
      next: (res) => {
        this.userData = res.result.user[0];
        const initials = this.userData.name
          .split(' ')
          .map((word) => word.charAt(0))
          .join('');

        this.shortName = initials.slice(0, 2);
        this.profileFormGroup.patchValue({
          name: this.userData.name,
          email: this.userData.email.address,
          bankIFSC: this.userData?.bankIFSC,
          bankAccNum: this.userData?.bankAccNum,
          bankName: this.userData?.bankName,
          upiId: this.userData?.upiId,
          paytmNumber: this.userData?.paytmNumber
            ? this.userData?.paytmNumber
            : this.userData.mobile?.number,
          panCard: this.userData?.panCard,
        });
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }
  onUpdateProfile() {
    // this.editMode = false;
    if (this.profileFormGroup.valid) {
      this.profileFormGroup.value.email = {
        address: this.profileFormGroup.value.email,
        isVerified: this.userData.email.isVerified,
      };

      this.api$ = this._userService.updateProfile(
        this.userData._id,
        this.profileFormGroup.value
      );

      this.api$.subscribe({
        next: (res) => {
          this._toastService.success('Profile updated!');
          this.profileFormGroup.reset();
          this.fetchUser();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Profile Form not valid!');
      Object.values(this.profileFormGroup.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  changePassword() {
    if (!this.changePasswordFormGroup.valid) {
      this._toastService.error('All Fields are required');
      return;
    }
    if (this.changePasswordFormGroup.valid) {
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
    } else {
      this._toastService.error('Profile Form not valid!');
      Object.values(this.changePasswordFormGroup.controls).forEach(
        (control) => {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      );
    }
  }
}
