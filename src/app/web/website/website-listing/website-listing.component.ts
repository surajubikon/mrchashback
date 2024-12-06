import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { Offer } from 'src/app/core/model/offer.model';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { OthersService } from 'src/app/core/service/others.service';

@Component({
  selector: 'app-website-listing',
  templateUrl: './website-listing.component.html',
  styleUrls: ['./website-listing.component.scss'],
})
export class WebsiteListingComponent implements OnInit {
  isSidebarVisible = false;
  options = ['Popularity', 'A-Z', 'Discount', 'Newest'];
  websiteData: WebsiteInterface[] = [];
  selectedCategory: CategoriesInterface = {} as CategoriesInterface;
  selectedSortKey: string = '';
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit(): void {
    this._route.queryParams.subscribe((res) => {
      if (res['selectedCategory']) {
        this.selectedCategory = JSON.parse(res['selectedCategory']);
        this.fetchWebsite();
      } else {
        this.fetchWebsite();
      }
    });
  }

  async fetchWebsite(sort?: any) {
    await this._otherService
      .fetchWebsite({
        ...(Object.keys(this.selectedCategory).length > 0 && {
          categoryId: this.selectedCategory._id,
        }),
        ...sort,
      })
      .subscribe({
        next: (res: { websites: WebsiteInterface[] }) => {
          this.websiteData = res.websites;
        },
        error: (error: any) => {
          this._toastService.error(error);
        },
      });
  }
  onRedirectToDetails(item: WebsiteInterface) {
    let senData: Offer = {
      icon: item.icon,
      url: item.url,
      name: item.name,
      trackingTime: item.trackingTime,
      allotmentTime: item.allotmentTime,
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
  handleSegmentChange(e: number): void {
    if (e === 0) {
      this.fetchWebsite();
    } else if (e === 1) {
      this.fetchWebsite({
        sortByAlphabeticalOrder: true,
      });
    } else if (e === 2) {
      this.fetchWebsite({
        sortByMaxCashback: true,
      });
    } else if (e === 3) {
      this.fetchWebsite({
        sortByLatest: true,
      });
    }
  }
}
