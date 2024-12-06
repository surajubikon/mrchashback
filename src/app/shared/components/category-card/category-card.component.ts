import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { environment } from 'src/app/environments/environment.prod';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
  @Input() item: CategoriesInterface = {} as CategoriesInterface;
  @Output() itemEvent = new EventEmitter<any>();
  baseUrl = environment.media_url;
}
