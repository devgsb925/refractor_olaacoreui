import { Injectable } from '@angular/core';
import { IDistributeProduct } from '../interfaces/i-distribute-product';

import { IArea } from '../interfaces/i-area';

@Injectable()
export class VmDistributeModalService {

  products: IDistributeProduct[] = [];
  selected_product: IDistributeProduct = {
    pId: 0,
    sku: '',
    productDesc: '',
    uidName: '',
    stockQty: 0,
    unitInWarehouse: 0,
    unitInDisplay: 0,
    unitInDemo: 0,
    unitInQc: 0,
    unsave: false,
    moveBy: '',
    requestBy: '',
    moveFrom: '--select--',
    movedQty: 0,
    to: '--select--',
    remarks: '',
    uid: [],
    uidType: '',
     masterUidList: []
  };

  moveFrom: IArea[] = [
    {
      name: '--select--',
      lock: false,
      select: true
    },
    {
      name: 'Warehouse',
      lock: false,
      select: false
    },
    {
      name: 'Display',
      lock: false,
      select: false
    },
    {
      name: 'Demo',
      lock: false,
      select: false
    },
    {
      name: 'QC',
      lock: false,
      select: false
    }
  ];
  moveTo: IArea[] = [
    {
      name: '--select--',
      lock: true,
      select: true
    },
    {
      name: 'Warehouse',
      lock: true,
      select: false
    },
    {
      name: 'Display',
      lock: true,
      select: false
    },
    {
      name: 'Demo',
      lock: true,
      select: false
    },
    {
      name: 'QC',
      lock: true,
      select: false
    }
  ];

  constructor() { }
}
