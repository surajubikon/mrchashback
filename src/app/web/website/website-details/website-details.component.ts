import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { Offer } from 'src/app/core/model/offer.model';
import { OthersService } from 'src/app/core/service/others.service';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss'],
})
export class WebsiteDetailsComponent {
  isLoading = false;
  isSidebarVisible = false;
  imgBaseUrl = environment.media_url;
  offer: Offer = {} as Offer;
  linkFormControl = new FormControl();
  copySuccess: boolean = false;
  showLoading: boolean = false;
  genratedLink: any;
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  redirectData: any;
  isReadyToShare: boolean = false;
  ngOnInit(): void {
    this._route.queryParams.subscribe((res) => {
      if (res['offer']) {
        this.offer = JSON.parse(res['offer']);
        // console.log(res['offer']);
      }
    });
    console.log('start website');
  }
  onClickMakeLink(offer: Offer) {
    if (this.linkFormControl.value) {
      const url = this.linkFormControl.value;
      const expression =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      const regex = new RegExp(expression);
      if (!url.match(regex)) {
        this._toastService.error('URL is not valid!');
        return;
      }
      this.isLoading = true;
      this.openStore(offer);
    } else {
      this._toastService.error('Please Enter URL!');
      return;
    }
  }
  copyToClipboard(text: string) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const success = document.execCommand('copy');
    document.body.removeChild(input);
    if (success) {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 5000); // Hide the message after 2 seconds
    }
  }

  async openStoreUsingActiveOffer(offer: Offer) {
    this.showLoading = true;
    this.redirectData = offer.icon;
    const subId = await this._otherService.getUniqueSubId();
  
    if (!subId) {
      this._toastService.error('Please login first to access this feature.');
      this._router.navigate(['/login'], {
        queryParams: {
          offer: JSON.stringify(offer),
        },
      });
      this.showLoading = false;
  
      return;
    }
  
    let companyId = offer.companyId;
    if (offer.name.toLowerCase() == 'amazon' && !companyId) {
      companyId = '14627';
    }
  
    this._otherService
      .generateTokenAndDeepLink(offer.url, subId, companyId)
      .pipe(finalize(() => {}))
      .subscribe({
        next: async (res: any) => {
          this.showLoading = false;
  
          if (res.result) {
            // Always ensure redirect to correct URL
            window.open(offer.url, '_system', 'location=yes');
          }
        },
        error: (err: any) => {
          this.showLoading = false;
          this._toastService.error(err);
        },
      });
  }
  
  async openStore(offer: Offer) {
    this.redirectData = offer.icon;
    const subId = await this._otherService.getUniqueSubId();
    this.showLoading = true;

    if (!subId) {
      this.isLoading = false;
      this._toastService.error('Please login first to access this feature.');
      this._router.navigate(['/login'], {
        queryParams: {
          offer: JSON.stringify(offer),
        },
      });
      this.showLoading = false;

      return;
    }
    // console.log('here', subId, offer);

    this._otherService
      .generateTokenAndDeepLink(
        this.linkFormControl.value,
        subId,
        offer.companyId
      )
      .pipe(finalize(() => {}))
      .subscribe({
        next: async (res: any) => {
          this.showLoading = false;

          if (res.result) {
            this.isLoading = false;
            this.genratedLink = res.result[0].link;
            // window.open(res.result[0], '_system', 'location=yes');
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.showLoading = false;

          this._toastService.error(err);
        },
      });
  }

  onNavigate(link: string, offer: Offer) {
    const decodedLink = decodeURIComponent(link);

    if (offer.name.toLowerCase() == 'amazon') {
      const amazonLinkMatch = decodedLink.match(/ulp=(https:\/\/www\.amazon\.in\/.+)/);

      if (amazonLinkMatch) {
        let amazonLink = amazonLinkMatch[1];
        if (!amazonLink.includes('tag=')) {
          const affiliateTag = 'mrcashback0e-21';
          amazonLink += amazonLink.includes('?') ? `&tag=${affiliateTag}` : `?tag=${affiliateTag}`;
        }

        window.open(amazonLink, '_blank');
        console.log('Affiliate Amazon link: ', amazonLink);
      } else {
        this._toastService.error('Amazon link could not be extracted or redirection is incorrect!');
      }

    } else {
      const isAmazonLink = decodedLink.includes('amazon.in');

      if (isAmazonLink) {
        this._toastService.error('Amazon product link cannot be used for ' + offer.name + '!');
      } else {
        window.open(link, '_blank');
      }
    }
  }  

  async openShare(offer: Offer) {
    this.showLoading = true;
    this.redirectData = offer.icon;

    const subId = await this._otherService.getUniqueSubId();
    if (!subId) {
      this.isLoading = false;
      this._toastService.error('Please login first to access this feature.');
      this._router.navigate(['/login'], {
        queryParams: {
          offer: JSON.stringify(offer),
        },
      });
      this.showLoading = false;

      return;
    }
    this._otherService
      .generateTokenAndDeepLink(offer.url, subId, offer.companyId)
      .pipe(
        finalize(() => {
          // loading.dismiss();
          this.showLoading = false;
        })
      )
      .subscribe({
        next: async (res) => {
          // if (res.result) {
          //   window.open(res.result[0], '_system', 'location=yes');
          // }
          console.log('Generate link to share: ', res.result[0].link);
          this.copyShareToClipboard(res.result[0].link);
        },
        error: (err) => {
          this._toastService.error(err);
        },
      });
  }
  copyShareToClipboard(text: string) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const success = document.execCommand('copy');
    document.body.removeChild(input);
    if (success) {
      this.isReadyToShare = true;
      setTimeout(() => {
        this.isReadyToShare = false;
      }, 5000); // Hide the message after 2 seconds
    }
  }
}
