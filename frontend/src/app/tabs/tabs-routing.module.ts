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
        path: 'live-scanner',
        loadChildren: () => import('../live-scanner/live-scanner.module').then(m => m.LiveScannerPageModule)
      },
      {
        path: 'identite-scanner',
        loadChildren: () => import('../identite-scanner/identite-scanner.module').then(m => m.IdentitePageModule)
      },
      {
        path: 'passport-scanner',
        loadChildren: () => import('../passport-scanner/passport-scanner.module').then(m => m.PassportScannerPageModule)
      },
      {
        path: 'stored-codes',
        loadChildren: () => import('../stored-codes/stored-codes.module').then(m => m.StoredCodesPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
