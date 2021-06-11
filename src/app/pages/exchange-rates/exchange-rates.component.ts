import { IExchangeRate } from './dto/interfaces/i-exchange-rate';
import { ProductReferencesViewModel } from './../../view-model/product-references-view-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/toast/toast-service';
import { ExchangeRateViewModel } from './view-model/exchange-rate-view-model';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit {
  position = 0;
  addModelForm = false;
  pageSize = 18;
  inprocess = false;
  selRow = 0;

  constructor(
    public vmExchangeRate: ExchangeRateViewModel,
    private toast: ToastService,
    public vmReferecnce: ProductReferencesViewModel
  ) {}

  ngOnInit(): void {
    this.searchExchangeRate('', 0);
  }

  addNewExchangeRate(typeId: string, value: string): void {
    const currencyTypeId = Number(typeId);
    const exchangeRateValue = Number(value);
    if (
      !this.inprocess &&
      !isNaN(currencyTypeId) &&
      !isNaN(exchangeRateValue)
    ) {
      this.inprocess = true;
      this.toast.doToast();
      const exchange = this.vmExchangeRate.exchangeRates.find(
        (rate) =>
          rate.purchasingRefCurrencyTypeId === currencyTypeId &&
          rate.exchangeRatesStatus > 0
      );
      this.vmExchangeRate
        .addNewExchangeRate(
          exchange !== undefined ? exchange.purchasingExchangeRateId : 0,
          currencyTypeId,
          exchangeRateValue
        )
        .toPromise()
        .then((res) => {
          if (res > 0) {
            this.vmExchangeRate.exchangeRates.push({
              purchasingExchangeRateId: res,
              rateCurrencyToKip: exchangeRateValue,
              refCurrencyType: this.vmReferecnce.getRefCurrencyTypeById(
                currencyTypeId
              ).currencyName,
              exchangeRatesStatus: 1,
              purchasingRefCurrencyTypeId: currencyTypeId,
              rateDate: new Date().toISOString(),
            });
            const oldIndex = this.vmExchangeRate.exchangeRates.findIndex(
              (rate) =>
                rate.purchasingRefCurrencyTypeId === currencyTypeId &&
                rate.exchangeRatesStatus === 1
            );
            if (oldIndex !== undefined) {
              this.vmExchangeRate.exchangeRates[oldIndex].exchangeRatesStatus = 0;
            }

          } else if (res === 0) {
            alert(
              'Error!! maybe your new exchange rate is exist already... Please try new value'
            );
          }
          this.toast.closeToast();
          this.inprocess = false;
          this.addModelForm = false;
        })
        .catch((err) => alert(err));
    }
  }

  updateExchangeRate(newId: number, typeId: number, event: any): void {
    const newIndex = this.vmExchangeRate.exchangeRates.findIndex(
      (rate) => rate.purchasingExchangeRateId === newId
    );

    if (
      !this.inprocess &&
      this.vmExchangeRate.exchangeRates[newIndex].exchangeRatesStatus === 0
    ) {
      this.inprocess = true;
      const exchange = this.vmExchangeRate.exchangeRates.find(
        (rate) =>
          rate.purchasingRefCurrencyTypeId === typeId &&
          rate.exchangeRatesStatus > 0
      );
      this.vmExchangeRate
        .updateExchangeRate(
          exchange !== undefined ? exchange.purchasingExchangeRateId : 0,
          newId
        )
        .toPromise()
        .then((res) => {
          if (res > 0) {
            this.vmExchangeRate.exchangeRates[newIndex].exchangeRatesStatus = 1;
            if (exchange !== undefined) {
              const oldIndex = this.vmExchangeRate.exchangeRates.findIndex(
                (rate) =>
                  rate.purchasingExchangeRateId ===
                  exchange.purchasingExchangeRateId
              );
              this.vmExchangeRate.exchangeRates[
                oldIndex
              ].exchangeRatesStatus = 0;
            }
          }
          this.inprocess = false;
        })
        .catch((err) => alert(err));
    } else if (
      this.vmExchangeRate.exchangeRates[newIndex].exchangeRatesStatus !== 0
    ) {
      event.target.checked = true;
    }
  }

  searchExchangeRate(value: string, type: number): void {
    if (!this.inprocess) {
      this.inprocess = true;
      this.toast.doToast();
      this.vmExchangeRate
        .searchExchangeRate(value, type)
        .toPromise()
        .then((res) => {
          if (res.length > 0) {
            this.vmExchangeRate.exchangeRates = res;
          } else if (res instanceof HttpErrorResponse) {
            alert(res.error.text);
          }
          this.inprocess = false;
          this.toast.closeToast();
        });
    }
  }

  getExchangeRates(typeId): IExchangeRate[] {
    const currencyTypeId = Number(typeId);
    if (currencyTypeId > 0) {
      return this.vmExchangeRate.exchangeRates.filter(rate => rate.purchasingRefCurrencyTypeId === currencyTypeId).sort(
        (a, b) => b.purchasingExchangeRateId - a.purchasingExchangeRateId
      );
    } else {
      return this.vmExchangeRate.exchangeRates.sort(
        (a, b) => b.purchasingExchangeRateId - a.purchasingExchangeRateId
      );
    }

  }
}
