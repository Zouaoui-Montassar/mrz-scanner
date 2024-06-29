import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassportScannerPage } from './passport-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: PassportScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportScannerPageRoutingModule {}
