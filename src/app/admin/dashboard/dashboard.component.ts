import { Component, OnInit, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Stats, StatsFetchResponse } from 'src/app/core/model/stats.model';
import { OthersService } from 'src/app/core/service/others.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  totalAmount: any;
  isDataLoad: boolean = false;
  stats: Stats = {} as Stats;
  ngOnInit(): void {
    this.fetchStats();
  }
  async fetchStats() {
    this.isDataLoad = true;
    this._otherService.fetchStats().subscribe({
      next: (res: StatsFetchResponse) => {
        this.isDataLoad = false;
        this.stats = res.result;
        if (this.isFloat(this.stats.TOTAL_PENDING_AMOUNT)) {
          let number = this.stats.TOTAL_PENDING_AMOUNT.toString();
          let finalNumber = number.split('.')[0];
          this.totalAmount = finalNumber;
        } else {
          this.totalAmount = this.stats.TOTAL_PENDING_AMOUNT;
        }
      },
      error: (error) => {
        this.isDataLoad = false;
        this._toastService.error(error);
      },
    });
  }
  isFloat(value: any) {
    return typeof value === 'number' && !Number.isNaN(value) && value % 1 !== 0;
  }
  parseValue(value: string | null): number {
    if (!value) return 0; // Return 0 if value is null or undefined

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 0; // Return 0 if value cannot be parsed as a number

    return numericValue;
  }
  parseTotalValue(value: string | number | null | undefined): number {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 0; // Return 0 if value is null, undefined, or not a valid number
    }
    return Number(value); // Convert value to a number
  }
  
}
