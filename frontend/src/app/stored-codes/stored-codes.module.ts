import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoredCodesPageRoutingModule } from './stored-codes-routing.module';

import { StoredCodesPage } from './stored-codes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoredCodesPageRoutingModule
  ],
  declarations: [StoredCodesPage]
})
export class StoredCodesPageModule {}
