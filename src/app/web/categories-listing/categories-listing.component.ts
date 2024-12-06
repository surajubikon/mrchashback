import { Component, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TYPE } from 'src/app/core/constant/app.constant';
import { CategoriesInterface } from 'src/app/core/model/categories.model';
import { OthersService } from 'src/app/core/service/others.service';

@Component({
  selector: 'app-categories-listing',
  templateUrl: './categories-listing.component.html',
  styleUrls: ['./categories-listing.component.scss'],
})
export class CategoriesListingComponent {
  // sortOptions: string[] = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65));
  sortOptions!: string[];
  allCategories: CategoriesInterface[] = [];
  private _toastService = inject(NzMessageService);
  private _otherService = inject(OthersService);

  ngOnInit(): void {
    this.fetchCategories();
  }

  async fetchCategories() {
    const postData = {
      type: TYPE[1],
    };
    await this._otherService.fetchCategories(postData).subscribe({
      next: (res) => {
        this.allCategories = res.result.categories;
        this.sortOptions = res.result.categories.reduce(
          (acc: string[], category) => {
            const firstChar = category.name.charAt(0).toUpperCase();
            if (!acc.includes(firstChar)) {
              acc.push(firstChar);
            }
            return acc;
          },
          []
        );
        console.log(this.sortOptions);
      },
      error: (err) => {
        this._toastService.error(err);
      },
    });
  }
}
