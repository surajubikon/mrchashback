import { Component,Input } from '@angular/core';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-redirection-loading',
  templateUrl: './redirection-loading.component.html',
  styleUrls: ['./redirection-loading.component.scss']
})
export class RedirectionLoadingComponent {
  @Input() redirectData: any;
  baseUrl = environment.media_url;
}
