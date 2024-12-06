import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {
  NzContentComponent,
  NzLayoutComponent,
  NzLayoutModule,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { WebHeaderComponent } from './components/web-header/web-header.component';
import { WebSidebarComponent } from './components/web-sidebar/web-sidebar.component';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselComponent, NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { WebsiteCardComponent } from './components/website-card/website-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AffiliateItemCardComponent } from './components/affiliate-item-card/affiliate-item-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { WebFooterComponent } from './components/web-footer/web-footer.component';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';
import { RedirectionLoadingComponent } from './components/redirection-loading/redirection-loading.component';
@NgModule({
  declarations: [
    WebHeaderComponent,
    WebSidebarComponent,
    WebsiteCardComponent,
    AffiliateItemCardComponent,
    CategoryCardComponent,
    SidebarComponent,
    DashboardHeaderComponent,
    WebFooterComponent,
    ProfileSidebarComponent,
    RedirectionLoadingComponent,
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzCardModule,
    NzModalModule,
    NzSpinModule,
    RouterModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzCarouselModule,
    NzDrawerModule,
    NzDropDownModule,
    NzFormModule,
    NzIconModule,
    NzSpinModule,
    NzAlertModule,
    NzInputModule,
    NzAvatarModule,
    NzModalModule,
    NzMenuModule,
    NzLayoutModule,
    NzSelectModule,
    NzSpaceModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NzLayoutModule,
    NzAlertModule,
    NzBreadCrumbModule,
    NzTagModule,
  ],
  exports: [
    WebHeaderComponent,
    WebFooterComponent,
    WebSidebarComponent,
    NzSiderComponent,
    NzLayoutComponent,
    NzCarouselComponent,
    NzBreadCrumbModule,
    NzContentComponent,
    SidebarComponent,
    WebsiteCardComponent,
    CategoryCardComponent,
    CategoryCardComponent,
    AffiliateItemCardComponent,
    DashboardHeaderComponent,
    ProfileSidebarComponent,
    RedirectionLoadingComponent,
  ],
})
export class SharedModule {}
