import { ICategory } from './i-category';
import { IBannerImage } from './i-banner-image';
export interface IBannerDataContainer {
  imageList: IBannerImage[];
  categories: ICategory[];
}
