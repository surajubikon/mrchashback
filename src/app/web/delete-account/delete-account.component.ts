import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OthersService } from 'src/app/core/service/others.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent {
  private _otherService = inject(OthersService);
  private _toastService = inject(NzMessageService);
  private _storageService = inject(StorageService);
  private _router = inject(Router);
  deleteAccountFG!: FormGroup;
  confirmModal?: NzModalRef;

  constructor(private fb: FormBuilder, private modal: NzModalService) {}
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.deleteAccountFG = this.fb.group({
      Email: new FormControl('', [Validators.required]),
      Mobile: new FormControl('', [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      Message: new FormControl('', [Validators.required]),
    });
  }
  sendEmail() {
    if (this.deleteAccountFG.valid) {
      this._otherService.sendEmail(this.deleteAccountFG.value).subscribe({
        next: (res) => {
          this._toastService.success(
            'Your request for account deletion has been submitted. You will receive an update withing 48 hours'
          );
          this.deleteAccountFG.reset();
          this._storageService.clearAllStorage();
          // this._router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: (error) => {
          this._toastService.error(error);
        },
      });
    } else {
      this._toastService.error('Form Not Valid!');
      Object.values(this.deleteAccountFG.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
