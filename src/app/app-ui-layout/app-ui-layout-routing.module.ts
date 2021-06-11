import { Routes } from '@angular/router';

export const AppUiLayoutRoutingModule: Routes = [
  {
    path: 'report',
    data: {
      role: 'reports',
    },
    loadChildren: () =>
      import('../pages/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'dashboard',
    data: {
      role: 'authorized',
    },
    loadChildren: () =>
      import('../pages/authorized/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'user-profile',
    data: {
      role: 'authorized',
    },
    loadChildren: () =>
      import('../pages/authorized/user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
  },
  {
    path: 'purchasing/orders',
    data: {
      role: 'orders',
    },
    loadChildren: () =>
      import('../pages/orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'purchasing/exchange-rates',
    data: {
      role: 'exchange-rates',
    },
    loadChildren: () =>
      import('../pages/exchange-rates/exchange-rates.module').then(
        (m) => m.ExchangeRatesModule
      ),
  },
  {
    path: 'purchasing/vendors',
    data: {
      role: 'vendors',
    },
    loadChildren: () =>
      import('../pages/vendors/vendors.module').then((m) => m.VendorsModule),
  },
  {
    path: 'warehouse/stockin',
    data: {
      role: 'stockin',
    },
    loadChildren: () =>
      import('../pages/stockin/stockin.module').then((m) => m.StockinModule),
  },
  {
    path: 'warehouse/stock-management',
    data: {
      role: 'stock-management',
    },
    loadChildren: () =>
      import('../pages/stock-management/stock-management.module').then((m) => m.StockManagementModule),
  },
  {
    path: 'store/inventory',
    data: {
      role: 'inventory',
    },
    loadChildren: () =>
      import('../pages/stock-inventory/stock-inventory.module').then((m) => m.StockInventoryModule),
  },
  {
    path: 'warehouse/picking',
    data: {
      role: 'picking',
    },
    loadChildren: () =>
      import('../pages/picking/picking.module').then((m) => m.PickingModule),
  },
  {
    path: 'purchasing/shipment',
    data: {
      role: 'shipment',
    },
    loadChildren: () =>
      import('../pages/shipment/shipment.module').then((m) => m.ShipmentModule),
  },
  {
    path: 'store',
    data: {
      role: 'authorized',
    },
    loadChildren: () =>
      import('../pages/store/store.module').then((m) => m.StoreModule),
  },
  {
    path: 'warehouse/barcode-manager',
    data: {
      role: 'barcode-manager',
    },
    loadChildren: () =>
      import('../pages/barcode-manager/barcode-manager.module').then(
        (m) => m.BarcodeManagerModule
      ),
  },
  {
    path: 'user-roles',
    data: {
      role: 'user-roles',
    },
    loadChildren: () =>
      import('../pages/user-roles/user-roles.module').then(
        (m) => m.UserRolesModule
      ),
  },
  {
    path: 'purchasing/values-setting',
    data: {
      role: 'purchasing',
    },
    loadChildren: () =>
      import('../pages/values-setting/values-setting.module').then(
        (m) => m.ValuesSettingModule
      ),
  },

  {
    path: 'permission',
    data: {
      role: 'authorized',
    },
    loadChildren: () =>
      import('../pages/permission/permission.module').then(
        (m) => m.PermissionModule
      ),
  },


  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
