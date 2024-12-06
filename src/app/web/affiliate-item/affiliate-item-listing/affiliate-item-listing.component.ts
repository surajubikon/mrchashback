import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AffiliateItemInterface } from 'src/app/core/model/affiliate.model';
import { Offer } from 'src/app/core/model/offer.model';
import { OthersService } from 'src/app/core/service/others.service';

@Component({
  selector: 'app-affiliate-item-listing',
  templateUrl: './affiliate-item-listing.component.html',
  styleUrls: ['./affiliate-item-listing.component.scss'],
})
export class AffiliateItemListingComponent {
  isSidebarVisible = false;
  options = ['Popularity', 'A-Z', 'Discount', 'Newest'];
  affilateItems: AffiliateItemInterface[] = [];
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  selectedItem: AffiliateItemInterface = {} as AffiliateItemInterface;
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  ngOnInit(): void {
    this._route.queryParams.subscribe((res) => {
      if (res['selectedItem']) {
        this.selectedItem = JSON.parse(res['selectedItem']);
        this.fetchProduct();
      } else {
        this.fetchProduct();
      }
    });
  }

  fetchProduct(sort?: any) {
    this._otherService
      .fetchAffiliateItems({
        ...(Object.keys(this.selectedItem).length > 0 && {
          categoryId: this.selectedItem._id,
        }),
        ...sort,
      })
      .subscribe({
        next: (res) => {
          this.affilateItems = res.result.affiliateItems;
        },
        error: (error) => {
          this._toastService.error(error);
        },
      });
  }
  onRedirectToDetails(item: AffiliateItemInterface) {
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
  handleSegmentChange(e: number): void {
    if (e === 0) {
      this.fetchProduct();
    } else if (e === 1) {
      this.fetchProduct({
        sortByAlphabeticalOrder: true,
      });
    } else if (e === 2) {
      this.fetchProduct({
        sortByMaxCashback: true,
      });
    } else if (e === 3) {
      this.fetchProduct({
        sortByLatest: true,
      });
    }
  }
}
