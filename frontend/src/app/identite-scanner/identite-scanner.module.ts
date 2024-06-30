import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentitePageRoutingModule } from './identite-scanner-routing.module';

import { IdentitePage } from './identite-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdentitePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [IdentitePage]
})
export class IdentitePageModule {}
