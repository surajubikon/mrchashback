import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss'],
})
export class ProfileSidebarComponent {
  @Input() active!: string;
  menuOptions = [
    { label: 'My Account', id: 'ACCOUNT', url: '/settings' },
    { label: 'Earnings', id: 'EARNINGS', url: '/earnings' },
    { label: 'Payment Requests', id: 'PAY_REQ', url: '/payment-history' },
    { label: 'Missing Cashback', id: 'MISSING_CASH', url: '/tickets' },
    { label: 'How to Use', id: 'HOWTOUSE', url: '/how-to-use' },
    { label: 'Refer and Earn', id: 'REFER', url: '/refer' },
  ];
}
