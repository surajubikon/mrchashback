import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  // standalone: true,
  // imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() activeMenu!: string;
}
