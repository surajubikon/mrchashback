import { query } from '@angular/animations';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { TYPE } from 'src/app/core/constant/app.constant';
import { AffiliateItemInterface } from 'src/app/core/model/affiliate.model';
import { BannerInterface } from 'src/app/core/model/banner.model';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { Offer } from 'src/app/core/model/offer.model';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: NzCarouselComponent;
  fetchBanner$!: Observable<any>;
  allBanner: BannerInterface[] = [];
  affilateItems: AffiliateItemInterface[] = [];
  websiteData: WebsiteInterface[] = [];
  allSortOrder: WebsiteInterface[] = [];
  allCategories: CategoriesInterface[] = [];
  isSidebarVisible = false;
  countdownInterval: any;
  delete$!: Observable<any>;
  baseUrl = environment.media_url;
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.fetchWebSortOrder();
    this.fetchBanner();
    this.fetchWebsite();
    this.fetchProduct();
    this.fetchCategories();
  }
  async fetchBanner() {
    this.fetchBanner$ = await this._otherService.fetchBanner();
    this.fetchBanner$.subscribe({
      next: (res) => {
        this.allBanner = res.result.banners;
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }

  pre(): void {
    this.carousel.pre();
  }

  next(): void {
    this.carousel.next();
  }

  async fetchProduct() {
    const postData = {};
    const currentDate = new Date();
    await this._otherService.fetchAffiliateItems(postData).subscribe({
      next: (res) => {
        this.affilateItems = [];
        res.result.affiliateItems.forEach((item: AffiliateItemInterface) => {
          const dealTimerDate = new Date(item.dealTimer);
          if (dealTimerDate > currentDate) {
            this.affilateItems.push(item);
          }
        });
        this.startCountdown();
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }
  async fetchWebsite() {
    await this._otherService.fetchWebsite().subscribe({
      next: (res) => {
        this.websiteData = res.websites;
      },
      error: (error) => {
        this._toastService.error(error);
      },
    });
  }
  async fetchCategories() {
    const postData = {
      type: TYPE[1],
    };
    await this._otherService.fetchCategories(postData).subscribe({
      next: (res) => {
        this.allCategories = res.result.categories;
      },
      error: (err) => {
        this._toastService.error(err);
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
  async fetchWebSortOrder() {
    this._otherService.fetchSortOrder().subscribe({
      next: (res) => {
        this.allSortOrder = res.result.data;
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.affilateItems.forEach((_) => {
        const convertedDealTime = new Date(_.dealTimer).getTime();

        const now = new Date().getTime();
        const distance = convertedDealTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        _.displayTimer =
          days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

        if (distance < 0) {
          _.displayTimer = 'Deal Expired';
        }
      });
    }, 1000);
  }
}
