import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoredCodesPage } from './stored-codes.page';

const routes: Routes = [
  {
    path: '',
    component: StoredCodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoredCodesPageRoutingModule {}
