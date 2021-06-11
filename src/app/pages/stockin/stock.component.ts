import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PendingShipmentViewModelService } from './view-model/pending-shipment-view-model.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  tabChange = 0;

  constructor(
    public vmPShipment: PendingShipmentViewModelService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe((res) => {
      console.log(res);

      const ref = res.stockinData;
      this.vmPShipment.setRefStockin(ref);
      this.vmPShipment.setPendingShipment(ref.pendingShipments);
      this.vmPShipment.setReceivedShipment(ref.recievedShipments);
    });
  }
}
