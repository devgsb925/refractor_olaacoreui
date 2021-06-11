import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExchangeRatesService } from '../api/exchange-rates.service';
import { IAddExchangeRate } from '../dto/model/i-add-exchange-rate';
import { IExchangeRate } from '../dto/interfaces/i-exchange-rate';
import { IUpdateExchangeRate } from '../dto/model/i-update-exchange-rate';

@Injectable()
export class ExchangeRateViewModel {
  exchangeRates: IExchangeRate[] = [];

  constructor(private apiExchangeRates: ExchangeRatesService) {}


  addNewExchangeRate(rateId: number, typeId: number, value: number): Observable<number>{
    const model: IAddExchangeRate = {
      exchangeRateId: rateId,
      purchasingRefCurrencyTypeId: typeId,
      rateCurrencyToKip: value
    };
    return this.apiExchangeRates.add(model);
  }

  updateExchangeRate(oldId: number, newId: number): Observable<number>{
    const model: IUpdateExchangeRate = {
      oldId, newId
    };
    return this.apiExchangeRates.update(model);
  }

  searchExchangeRate(searvalue: string, type: number): Observable<IExchangeRate[]> {
    return this.apiExchangeRates.searchExchangeRate(searvalue, type);
  }
}
