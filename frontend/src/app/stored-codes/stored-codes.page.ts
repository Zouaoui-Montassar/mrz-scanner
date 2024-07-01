import { Component, OnInit } from '@angular/core';
import { PassportService } from '../services/passport.service';

@Component({
  selector: 'app-stored-codes',
  templateUrl: './stored-codes.page.html',
  styleUrls: ['./stored-codes.page.scss'],
})
export class StoredCodesPage {
  passports: any[] = [];

  constructor(private passportService: PassportService) {}

  ionViewWillEnter() {
    this.loadPassports();
  }

  loadPassports() {
    this.passportService.getPassports().subscribe((res:any) => {
      console.log("data: ",res);
      this.passports=res.data.data;
    })
  }
  
  
}
