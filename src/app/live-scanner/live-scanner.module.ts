import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveScannerPageRoutingModule } from './live-scanner-routing.module';

import { LiveScannerPage } from './live-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveScannerPageRoutingModule
  ],
  declarations: [LiveScannerPage]
})
export class LiveScannerPageModule {}
