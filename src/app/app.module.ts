import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './web/home/home.component';
import { AffiliateItemListingComponent } from './web/affiliate-item/affiliate-item-listing/affiliate-item-listing.component';
import { AffiliateItemDetailsComponent } from './web/affiliate-item/affiliate-item-details/affiliate-item-details.component';
import { WebsiteListingComponent } from './web/website/website-listing/website-listing.component';
import { WebsiteDetailsComponent } from './web/website/website-details/website-details.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

registerLocaleData(en);
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthInterceptor } from './core/service/auth.interceptor';
import { WebsitesComponent } from './admin/websites/websites.component';
import { AffiliateItemsComponent } from './admin/affiliate-items/affiliate-items.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { BannersComponent } from './admin/banners/banners.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { PaymentRequestsComponent } from './admin/payment-requests/payment-requests.component';
import { LeadsComponent } from './admin/leads/leads.component';
import { OpenOrdersComponent } from './admin/open-orders/open-orders.component';
import { ClosedOrdersComponent } from './admin/closed-orders/closed-orders.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CustomerSettingsComponent } from './web/customer-settings/customer-settings.component';
import { MissingCashbackComponent } from './web/missing-cashback/missing-cashback.component';
import { MyEarningsComponent } from './web/my-earnings/my-earnings.component';
import { MyPaymentRequestsComponent } from './web/my-payment-requests/my-payment-requests.component';
import { ReferAndEarnComponent } from './web/refer-and-earn/refer-and-earn.component';
import { AboutComponent } from './web/about/about.component';
import { ContactComponent } from './web/contact/contact.component';
import { TermsComponent } from './web/terms/terms.component';
import { PrivacyComponent } from './web/privacy/privacy.component';
import { CategoriesListingComponent } from './web/categories-listing/categories-listing.component';
import { DeleteAccountComponent } from './web/delete-account/delete-account.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { KConverterPipe } from './core/service/k_converter';
import { MissingCashbackAdminComponent } from './admin/missing-cashback/missing-cashback.component';
import { ReferralEarningsComponent } from './admin/referral-earnings/referral-earnings.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { InviteComponent } from './web/invite/invite.component';
import { RemoveDecimalPipe } from './core/pipe/remove-decimal.pipe';
import { VersionComponent } from './admin/version/version.component';
import { ReferralEarningsReportComponent } from './admin/referral-earnings-report/referral-earnings-report.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HowToUseComponent } from './web/how-to-use/how-to-use.component';
@NgModule({
  declarations: [
    KConverterPipe,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AffiliateItemListingComponent,
    AffiliateItemDetailsComponent,
    WebsiteListingComponent,
    WebsiteDetailsComponent,
    DashboardComponent,
    WebsitesComponent,
    AffiliateItemsComponent,
    CategoriesComponent,
    BannersComponent,
    CustomersComponent,
    PaymentRequestsComponent,
    LeadsComponent,
    OpenOrdersComponent,
    ClosedOrdersComponent,
    NotificationsComponent,
    RemoveDecimalPipe,
    SettingsComponent,
    CustomerSettingsComponent,
    MissingCashbackComponent,
    MyEarningsComponent,
    MyPaymentRequestsComponent,
    ReferAndEarnComponent,
    AboutComponent,
    ContactComponent,
    TermsComponent,
    PrivacyComponent,
    CategoriesListingComponent,
    DeleteAccountComponent,
    MissingCashbackAdminComponent,
    ReferralEarningsComponent,
    InviteComponent,
    VersionComponent,
    ReferralEarningsReportComponent,
    HowToUseComponent,
  ],
  imports: [
    NgHttpLoaderModule.forRoot(),
    NzEmptyModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NzDatePickerModule,
    NzIconModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzCardModule,
    NzPaginationModule,
    NzCarouselModule,
    NzGridModule,
    NzInputModule,
    NzFormModule,
    NzSegmentedModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzMessageModule,
    SharedModule,
    NzUploadModule,
    NzBreadCrumbModule,
    NzDrawerModule,
    NzDropDownModule,
    NzTagModule,
    NzSpinModule,
    NzAlertModule,
    NzAvatarModule,
    NzPageHeaderModule,
    NzPopoverModule,
    NzMenuModule,
    NzLayoutModule,
    NzSelectModule,
    NzSpaceModule,
    NzStatisticModule,
    NzStepsModule,
    NzTableModule,
    NzTabsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
