import { IRefModels } from './i-ref-model';
import { IVariant } from './i-variant';
import { IRefExchangeRate } from './i-ref-exchange-rate';
import { IRefFlags } from './i-ref-flags';
import { IRefCategory } from './i-ref-category';
import { IRefBrands } from './i-ref-brands';

import { IRefCurrencyTypes } from './i-ref-refCurrencyTypes';

export interface IProductReferences {
  refCategories: IRefCategory[];
  refModels: IRefModels[];
  refFlags: IRefFlags[];
  refBrands: IRefBrands[];
  refExchangeRates: IRefExchangeRate[];
  refCurrencyTypes: IRefCurrencyTypes[];
  variants: IVariant[];
}
