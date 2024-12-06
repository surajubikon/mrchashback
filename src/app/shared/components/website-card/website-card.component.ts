import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebsiteInterface } from 'src/app/core/model/website.model';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-website-card',
  templateUrl: './website-card.component.html',
  styleUrls: ['./website-card.component.scss'],
})
export class WebsiteCardComponent {
  @Input() item: WebsiteInterface = {} as WebsiteInterface;
  @Output() itemEvent = new EventEmitter<any>();
  baseUrl = environment.media_url;
}
