import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassportScannerPageRoutingModule } from './passport-scanner-routing.module';

import { PassportScannerPage } from './passport-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassportScannerPageRoutingModule
  ],
  declarations: [PassportScannerPage]
})
export class PassportScannerPageModule {}
