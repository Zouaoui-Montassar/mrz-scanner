import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveScannerPage } from './live-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: LiveScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveScannerPageRoutingModule {}
