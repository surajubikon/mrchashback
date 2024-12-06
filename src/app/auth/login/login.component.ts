import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  NonNullableFormBuilder,
  FormBuilder,
  MaxLengthValidator,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { interval, map, takeWhile } from 'rxjs';
import {
  OTP_TIMER,
  USER_STORAGE_KEY,
} from 'src/app/core/constant/app.constant';
import { MOBILE_REGEX } from 'src/app/core/constant/regex.constants';
import { DeviceInfo } from 'src/app/core/model/device.model';
import { Offer } from 'src/app/core/model/offer.model';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  isOTPReq: boolean = true;
  private _toastService = inject(NzMessageService);
  private _router = inject(Router);
  private _userService = inject(UserService);
  private _storageService = inject(StorageService);
  otpFormControl = new FormControl('', [Validators.required]);
  offer: Offer = {} as Offer;
  isModalOpen: boolean = false;
  isUserExists: boolean = false;
  confirmModal?: NzModalRef;
  private modal = inject(NzModalService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _fb = inject(FormBuilder);
  validateForm!: FormGroup;
  inviteCode: string = '';
  deviceInfo: DeviceInfo = {} as DeviceInfo;
  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this._route.queryParams.subscribe((res) => {
      if (res['offer']) {
        this.offer = JSON.parse(res['offer']);
      }
    });
    this._route.queryParams.subscribe((res) => {
      if (res.hasOwnProperty('inviteCode')) {
        this.inviteCode = res['inviteCode'];
      }
    });
    this._route.queryParams.subscribe((res) => {
      if (res.hasOwnProperty('deviceInfo')) {
        this.deviceInfo = JSON.parse(res['deviceInfo']);
      }
    });
  }

  buildForm() {
    this.validateForm = this._fb.group({
      // userName: new FormControl('9826000001', [
      //   Validators.required,
      //   Validators.pattern(MOBILE_REGEX),
      // ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(MOBILE_REGEX),
      ]),
      password: new FormControl('9425012345', [Validators.required]),
      deviceToken: new FormControl(),
    });
  }

  onChangeLoginType() {
    this.isOTPReq = !this.isOTPReq;
    this.validateForm.reset();
  }
  onOTPRequest() {
    const userNameControl = this.validateForm.get('userName');

    if (userNameControl) {
      // Null check
      if (userNameControl.valid) {
        this._userService
          .userOTPReq({
            to: userNameControl.value,
            action: 'LOGIN',
          })
          .subscribe({
            next: (res) => {
              this._toastService.success('OTP Sent Successfully');
              this.openModal();
              this.isUserExists = res.result.isUserExists; // Assuming 'isUserExists' is directly returned in the response
            },
            error: (err) => {
              this._toastService.error(err);
            },
          });
      } else {
        userNameControl.markAsDirty();
        userNameControl.updateValueAndValidity({ onlySelf: true });

        if (userNameControl.invalid) {
          this._toastService.error('User Mobile is Not Valid!');
        }
      }
    } else {
      console.error('userNameControl is null.');
    }
  }

  openModal() {
    this.isModalOpen = true;
  }
  onCancelModal() {
    this.isModalOpen = false;
  }
  resendOtpTimer$ = interval(1000).pipe(
    map((value) => {
      return OTP_TIMER - value;
    }),
    takeWhile((value) => value <= OTP_TIMER)
  );

  onVerifyOTP() {
    let userData: any = {};
    if (this.isUserExists === true) {
      userData = {
        verify: this.validateForm.value.userName,
        action: 'LOGIN',
        otp: this.otpFormControl.value,
      };
    } else {
      userData = {
        isRegister: true,
        verify: this.validateForm.value.userName,
        action: 'REGISTER',
        otp: this.otpFormControl.value,
      };
    }

    this._userService.verifyOTP(userData).subscribe({
      next: (res) => {
        if (this.isOTPReq) {
          this.onCancelModal();
        }
        if (this.isUserExists === true) {
          this._storageService.setToStorage(USER_STORAGE_KEY, res.result);
          if (Object.keys(this.offer).length) {
            this._location.back();
            return;
          }

          if (res.result.user.type === 'CUSTOMER') {
            this._router.navigateByUrl('/home');
          } else if (res.result.user.type === 'ADMIN') {
            this._router.navigateByUrl('/dashboard/home');
          }
        } else {
          this._router.navigate(['/register'], {
            queryParams: {
              mobile: this.validateForm.value.userName,
              ...(this.inviteCode && { inviteCode: this.inviteCode }),
              ...(this.deviceInfo && {
                deviceInfo: JSON.stringify(this.deviceInfo),
              }),
            },
          });
          // this._router.navigateByUrl(
          //   '/register/' + this.validateForm.value.userName
          // );
        }
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.validateForm.value.deviceToken = 'sdhfvbhdsbhbhdsbch';
      this.isLoading = true;
      this._userService.userLogin(this.validateForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this._storageService.setToStorage(USER_STORAGE_KEY, res.result);
          if (Object.keys(this.offer).length) {
            this._location.back();
            return;
          }

          if (res.result.user.type === 'CUSTOMER') {
            this._router.navigateByUrl('/home');
          } else if (res.result.user.type === 'ADMIN') {
            this._router.navigateByUrl('/dashboard/home');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this._toastService.error(err);
        },
        complete() {},
      });
    } else {
      this._toastService.error('LOGIN_FORM_MSG');
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  togglePlayPause(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}
