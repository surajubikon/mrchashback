import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './web/home/home.component';
import { AffiliateItemListingComponent } from './web/affiliate-item/affiliate-item-listing/affiliate-item-listing.component';
import { WebsiteListingComponent } from './web/website/website-listing/website-listing.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
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
import { WebsiteDetailsComponent } from './web/website/website-details/website-details.component';
import { CustomerSettingsComponent } from './web/customer-settings/customer-settings.component';
import { MissingCashbackComponent } from './web/missing-cashback/missing-cashback.component';
import { MyEarningsComponent } from './web/my-earnings/my-earnings.component';
import { MyPaymentRequestsComponent } from './web/my-payment-requests/my-payment-requests.component';
import { ReferAndEarnComponent } from './web/refer-and-earn/refer-and-earn.component';
import { TermsComponent } from './web/terms/terms.component';
import { AboutComponent } from './web/about/about.component';
import { ContactComponent } from './web/contact/contact.component';
import { PrivacyComponent } from './web/privacy/privacy.component';
import { AffiliateItemDetailsComponent } from './web/affiliate-item/affiliate-item-details/affiliate-item-details.component';
import { CategoriesListingComponent } from './web/categories-listing/categories-listing.component';
import { AuthGuard } from './core/service/auth.guard';
import { SessionGuard } from './core/service/session.guard';
import { DeleteAccountComponent } from './web/delete-account/delete-account.component';
import { RegisterComponent } from './auth/register/register.component';
import { MissingCashbackAdminComponent } from './admin/missing-cashback/missing-cashback.component';
import { ReferralEarningsComponent } from './admin/referral-earnings/referral-earnings.component';
import { InviteComponent } from './web/invite/invite.component';
import { VersionComponent } from './admin/version/version.component';
import { ReferralEarningsReportComponent } from './admin/referral-earnings-report/referral-earnings-report.component';
import { HowToUseComponent } from './web/how-to-use/how-to-use.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'categories',
    component: CategoriesListingComponent,
  },
  {
    path: 'deals',
    component: AffiliateItemListingComponent,
  },
  {
    path: 'delete',
    component: DeleteAccountComponent,
    // component: RemoveAccountComponent,
  },
  {
    path: 'deals/details',
    component: AffiliateItemDetailsComponent,
  },
  {
    path: 'settings',
    component: CustomerSettingsComponent,
  },
  {
    path: 'tickets',
    component: MissingCashbackComponent,
    // canActivate: [SessionGuard],
  },
  {
    path: 'earnings',
    component: MyEarningsComponent,
    // canActivate: [SessionGuard],
  },
  {
    path: 'refer',
    component: ReferAndEarnComponent,
  },
  {
    path: 'how-to-use',
    component: HowToUseComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'invite/:inviteCode',
    component: InviteComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'delete',
    component: DeleteAccountComponent,
  },
  {
    path: 'payment-history',
    component: MyPaymentRequestsComponent,
  },
  {
    path: 'stores',
    component: WebsiteListingComponent,
  },
  {
    path: 'stores/details',
    component: WebsiteDetailsComponent,
  },
  {
    path: 'dashboard/home',
    component: DashboardComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/notifications',
    component: NotificationsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/closed-orders',
    component: ClosedOrdersComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/open-orders',
    component: OpenOrdersComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/missing-cashback',
    component: MissingCashbackAdminComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/referral-earnings',
    component: ReferralEarningsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/referral-earnings-reports',
    component: ReferralEarningsReportComponent,
    canActivate: [SessionGuard],
  },

  {
    path: 'dashboard/leads',
    component: LeadsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/payment-requests',
    component: PaymentRequestsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/customers',
    component: CustomersComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/banners',
    component: BannersComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/categories',
    component: CategoriesComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/deals',
    component: AffiliateItemsComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/stores',
    component: WebsitesComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'dashboard/version',
    component: VersionComponent,
    canActivate: [SessionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
