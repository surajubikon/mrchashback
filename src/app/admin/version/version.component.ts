import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OthersService } from 'src/app/core/service/others.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
})
export class VersionComponent {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  isDataLoad: boolean = false;
  versionFormGroup!: FormGroup;
  constructor(private fb: FormBuilder) {}
  async ngOnInit(): Promise<void> {
    this.buildUserForm();
    this.onGetVersion();
  }

  buildUserForm() {
    this.versionFormGroup = this.fb.group({
      version: ['', [Validators.required]],
    });
  }

  onGetVersion() {
    this._otherService.fetchVersion().subscribe({
      next: (res) => {
        console.log(res);
        this.versionFormGroup.patchValue({ version: res?.result?.version });
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }

  submitCreateForm() {
    if (this.versionFormGroup.valid) {
      this._otherService.createVersion(this.versionFormGroup.value).subscribe({
        next: (res) => {
          console.log(res);
          this._toastService.success('Updated Successfully');
          this.onGetVersion();
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
    } else {
      this._toastService.error('Form not Valid!');
      Object.values(this.versionFormGroup.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
