import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-web-sidebar',
  templateUrl: './web-sidebar.component.html',
  styleUrls: ['./web-sidebar.component.scss']
})
export class WebSidebarComponent {
  @Input() activeMenu!: string;
}
