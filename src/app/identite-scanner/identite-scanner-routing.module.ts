import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentitePage } from './identite-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: IdentitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentitePageRoutingModule {}
