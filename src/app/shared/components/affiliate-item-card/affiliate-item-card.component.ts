import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AffiliateItemInterface } from 'src/app/core/model/affiliate.model';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-affiliate-item-card',
  templateUrl: './affiliate-item-card.component.html',
  styleUrls: ['./affiliate-item-card.component.scss'],
})
export class AffiliateItemCardComponent {
  @Input() item: AffiliateItemInterface = {} as AffiliateItemInterface;
  @Output() itemEvent = new EventEmitter<any>();
  baseUrl = environment.media_url;
}
