import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DeviceInfo } from 'src/app/core/model/device.model';
import { DeviceInfoService } from 'src/app/core/service/device-info.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent {
  inviteCode: string = '';
  private _router = inject(Router);
  deviceInfo: DeviceInfo = {} as DeviceInfo;
  private _toastService = inject(NzMessageService);

  constructor(
    private _route: ActivatedRoute,
    private deviceInfoService: DeviceInfoService
  ) {}

  ngOnInit() {
    this.deviceInfo = this.deviceInfoService.getDeviceInfo();
    console.log('DEVICE INFO: ', this.deviceInfo);

    this._route.params.subscribe({
      next: (res) => {
        if (res.hasOwnProperty('inviteCode')) {
          this.inviteCode = res['inviteCode'];
          // this.onNavigate();
          if (this.deviceInfo.os === 'iOS') {
            navigator.clipboard
              .writeText(this.inviteCode)
              .then(() => {
                // navigate to apple store
                window.location.assign(
                  'https://apps.apple.com/in/app/mr-cashback/id6502233780'
                );
              })
              .catch((error) => {
                this._toastService.error(
                  'Something went wrong, error is - ' + error
                );
              });
          } else if (this.deviceInfo.os === 'Android') {
            window.open(`
            'https://play.google.com/store/apps/details?id=io.mrcashback.app&referrer=' +
           ${this.inviteCode}`);
          } else {
            this.onNavigate();
          }
        }
      },
    });
  }
  onCopyCode() {
    navigator.clipboard
      .writeText(this.inviteCode)
      .then(() => {
        // navigate to apple store
        window.location.assign(
          'https://apps.apple.com/in/app/mr-cashback/id6502233780'
        );
      })
      .catch((error) => {
        this._toastService.error('Something went wrong, error is - ' + error);
      });
  }
  onNavigate() {
    this._router.navigate(['/login'], {
      queryParams: {
        inviteCode: this.inviteCode,
        deviceInfo: JSON.stringify(this.deviceInfo),
      },
    });
  }
}
