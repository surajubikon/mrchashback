import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  USER_STORAGE_KEY,
  USER_TYPE,
  USER_TYPES,
} from 'src/app/core/constant/app.constant';
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  MOBILE_REGEX,
} from 'src/app/core/constant/regex.constants';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DeviceInfo } from 'src/app/core/model/device.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userFormGroup!: FormGroup;
  createUser$!: Observable<any>;
  private _toastService = inject(NzMessageService);
  isLoading = false;
  referralCode: any;
  inviteCode: string = '';
  deviceInfo: DeviceInfo = {} as DeviceInfo;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _storage: StorageService
  ) {}

  ngOnInit() {
    let storage = this._storage.getFromStorage(USER_STORAGE_KEY);
    if (storage.user && storage.user.type === USER_TYPES.CUSTOMER) {
      this._toastService.error('User already logged in');
      this._router.navigate(['/home']);
      return;
    }
    this.buildForm();
    // this.setReferralCode();
    this._route.queryParams.subscribe((res) => {
      if (res['referralCode']) {
        this.referralCode = JSON.parse(res['referralCode']);
      }
    });
    this._route.queryParams.subscribe((res) => {
      if (res.hasOwnProperty('inviteCode')) {
        this.inviteCode = res['inviteCode'];
        this.userFormGroup.patchValue({
          referralCode: this.inviteCode,
        });
      }
    });
    this._route.queryParams.subscribe((res) => {
      if (res.hasOwnProperty('deviceInfo')) {
        this.deviceInfo = JSON.parse(res['deviceInfo']);
      }
    });

    this._route.queryParams.subscribe({
      next: (_: any) => {
        console.log(_.mobile);
        if (_.hasOwnProperty('mobile')) {
          this.userFormGroup.patchValue({
            mobile: _['mobile'],
          });
        }
      },
    });
    console.log(this.deviceInfo);
  }

  buildForm() {
    this.userFormGroup = this._formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(PASSWORD_REGEX),
      ]),
      name: new FormControl('', [
        Validators.required,
        // Validators.pattern(FULL_NAME_REGEX),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGEX),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(MOBILE_REGEX),
      ]),
      status: new FormControl('ACTIVE'),
      referralCode: new FormControl(null),
    });
  }

  // async setReferralCode() {
  //   const referrer = await Referrer.getReferrerDetails();
  //   // const code = await this._storage.getStorage('ReferralCodeUrlPref');
  //   if (referrer && referrer.referrerUrl) {
  //     // const code = referrer.referrerUrl.split('&')[1].split('=')[1];
  //     this.userFormGroup.patchValue({
  //       referralCode: referrer.referrerUrl,
  //     });
  //   }
  // }

  createUser() {
    if (this.userFormGroup.valid) {
      this.isLoading = true;
      this.userFormGroup.value['referralCode'] = this.inviteCode;
      // this.userFormGroup.value['referralCode'] = this.referralCode;
      this.userFormGroup.value['userName'] = this.userFormGroup.value.mobile;
      this.userFormGroup.value['type'] = USER_TYPE[1];
      this.createUser$ = this._userService.createUserAccount(
        this.userFormGroup.value
      );
      this.createUser$.subscribe({
        next: (res) => {
          this.isLoading = false;
          this._toastService.success('Registered sucessfully!');
          // this._router.navigateByUrl('/login');
          this._storage.setToStorage(USER_STORAGE_KEY, res.result);
          if (res.result.user.type === 'CUSTOMER') {
            this._router.navigateByUrl('/home');
          } else if (res.result.user.type === 'ADMIN') {
            this._router.navigateByUrl('/dashboard/home');
          }
          this.userFormGroup.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this._toastService.error(error);
        },
      });
    } else {
      this._toastService.error('Form Not Valid!');
      Object.values(this.userFormGroup.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
