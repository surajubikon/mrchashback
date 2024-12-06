import { Component } from '@angular/core';

@Component({
  selector: 'app-web-footer',
  templateUrl: './web-footer.component.html',
  styleUrls: ['./web-footer.component.scss'],
})
export class WebFooterComponent {
  openPlayStore() {
    window.open(
      'https://play.google.com/store/apps/details?id=io.mrcashback.app',
      '_blank'
    );
  }
  openAppStore() {
    window.open(
      'https://apps.apple.com/in/app/mr-cashback/id6502233780',
      '_blank'
    );
  }
}
