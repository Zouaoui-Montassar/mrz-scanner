import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentitePageRoutingModule } from './identite-scanner-routing.module';

import { IdentitePage } from './identite-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdentitePageRoutingModule
  ],
  declarations: [IdentitePage]
})
export class QrScannerPageModule {}
