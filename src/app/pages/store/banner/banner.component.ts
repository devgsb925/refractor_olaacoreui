import { BannerViewModelService } from './banner-view-model.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  constructor(private viewModel: BannerViewModelService) {}

  ngOnInit(): void {
    if (this.viewModel.getReferences().length === 0) {
      this.viewModel
        .readBannerReference()
        .toPromise()
        .then((res) => {
          this.viewModel.setBannerReference(res);
        });

      this.viewModel
        .readBannerDataContainer()
        .toPromise()
        .then((res) => {
          this.viewModel.setImageList(res.imageList);
          this.viewModel.setCategories(res.categories);
          if (res.imageList.filter((img) => img.refBannerId === 1).length > 0) {
            this.viewModel.bannerSelectId = res.imageList
              .filter((img) => img.refBannerId === 1)
              .sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1))[0].id;
          } else if (
            res.imageList.filter((img) => img.refBannerId === 4).length > 0
          ) {
            this.viewModel.bannerSelectId = res.imageList
              .filter((img) => img.refBannerId === 4)
              .sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1))[0].id;
          } else if (
            res.imageList.filter((img) => img.refBannerId === 5).length > 0
          ) {
            this.viewModel.bannerSelectId = res.imageList
              .filter((img) => img.refBannerId === 5)
              .sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1))[0].id;
          } else if (
            res.imageList.filter((img) => img.refBannerId === 6).length > 0
          ) {
            this.viewModel.bannerSelectId = res.imageList
              .filter((img) => img.refBannerId === 6)
              .sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1))[0].id;
          }

          this.viewModel.categorySelectId = res.categories[0].id;
        });
    }
  }
}
