// src/app/tabs/tabs-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'mrz-scanner',
        loadChildren: () => import('../mrz-scanner/mrz-scanner.module').then(m => m.MrzScannerPageModule)
      },
      {
        path: 'qr-scanner',
        loadChildren: () => import('../qr-scanner/qr-scanner.module').then(m => m.QrScannerPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/mrz-scanner',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/mrz-scanner',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
