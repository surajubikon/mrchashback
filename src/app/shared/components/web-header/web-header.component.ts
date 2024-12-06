import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import {
  USER_STORAGE_KEY,
  USER_TYPES,
} from 'src/app/core/constant/app.constant';
import { AffiliateItemInterface } from 'src/app/core/model/affiliate.model';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import {
  GlobalSeachApiResponse,
  GlobalSeachInterface,
} from 'src/app/core/model/global-search.model';
import { Offer } from 'src/app/core/model/offer.model';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { StorageService } from 'src/app/core/service/storage.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.scss'],
})
export class WebHeaderComponent {
  private _storageService = inject(StorageService);
  private _router = inject(Router);
  confirmModal?: NzModalRef;
  isUserLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;
  searchFormControl = new FormControl();
  searchText: string | any = '';
  private _userService = inject(UserService);
  private _toastService = inject(NzMessageService);
  selectedValue = null;
  listOfResults: any = {} as any;
  nzFilterOption = (): boolean => true;
  showSearch = false;

  requests: any[] = [];
  constructor(private modal: NzModalService) {
    this.onCheckStorage();
    this.onSearch();
    if (this._router.url === '/home') {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }
  onCheckStorage() {
    let storage = this._storageService.getFromStorage(USER_STORAGE_KEY);
    if (!storage.token && !storage) {
      (this.isAdminLoggedIn = false), (this.isUserLoggedIn = false);
      return;
    } else if (storage.user && storage.user.type === USER_TYPES.CUSTOMER) {
      this.isUserLoggedIn = true;
    } else if (storage.user && storage.user.type === USER_TYPES.ADMIN) {
      this.isAdminLoggedIn = true;
    }
  }

  onGetResult(): void {
    this._userService
      .fetchGlobalSearch({
        ...(this.searchText && { searchText: this.searchText }),
      })
      .subscribe({
        next: (res: any) => {
          this.listOfResults = res.result;
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
  onSearchInputChange(value: string) {
    console.log(value);
    if (value) {
      this.searchFormControl.patchValue(value);
    }
  }
  onSearch() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res: any) => {
          this.searchText = res;
          this.onGetResult();
        })
      )
      .subscribe();
  }
  getLabel(type: string): string {
    switch (type) {
      case 'affiliateItems':
        return 'Found Deals';
      case 'websites':
        return 'Found Stores';
      case 'categories':
        return 'Found Categories';
      default:
        return '';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'affiliateItems':
        return 'Deals';
      case 'websites':
        return 'Stores';
      case 'categories':
        return 'Categories';
      default:
        return '';
    }
  }
  onSelect(ev: any) {
    if (ev.categoryId && ev.websiteId) {
      this.onRedirectToItemDetails(ev);
    }
    if (!ev.hasOwnProperty('categoryId') && !ev.hasOwnProperty('websiteId')) {
      this.onRedirectToStore(ev);
    }
    if (ev.companyId) {
      this.onRedirectToDetails(ev);
    }
  }
  onRedirectToDetails(item: WebsiteInterface) {
    let senData: Offer = {
      icon: item.icon,
      url: item.url,
      name: item.name,
      maximumCashback: item.maximumCashback ? item.maximumCashback : 0,
      termsAndCondition: item.termsAndConditions ? item.termsAndConditions : [],
      companyId: item.companyId,
      websiteId: {
        icon: item.icon,
      },
    };
    this._router.navigate(['/stores/details'], {
      queryParams: {
        offer: JSON.stringify(senData),
      },
    });
  }
  onRedirectToStore(item: CategoriesInterface) {
    this._router.navigate(['/stores'], {
      queryParams: {
        selectedCategory: JSON.stringify(item),
      },
    });
  }
  onRedirectToItemDetails(item: AffiliateItemInterface) {
    let senData: Offer = {
      icon: item.imageUrl,
      url: item.url,
      name: item.brand,
      companyId: item.websiteId.companyId,
      websiteId: {
        icon: item.websiteId.icon,
      },
    };
    this._router.navigate(['/deals/details'], {
      queryParams: {
        offer: JSON.stringify(senData),
      },
    });
  }

  onLogOut(): void {
    this.confirmModal = this.modal.warning({
      nzTitle: 'Logout Confirmation',
      nzContent: 'Are you sure you want to logout?',
      nzOnOk: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this._storageService.clearAllStorage();
          await this._router.navigateByUrl('/login', { replaceUrl: true });
        } catch (error) {
          console.error('Oops errors!', error);
        }
      },
    });
  }
  onLogin(): void {
    this._router.navigateByUrl('/login');
  }
  onNavigateToDashbaord() {
    this._router.navigateByUrl('/dashboard/home');
  }
}
