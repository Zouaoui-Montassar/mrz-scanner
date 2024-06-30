import { Component, OnInit } from '@angular/core';
import { PassportService } from '../services/passport.service';

@Component({
  selector: 'app-stored-codes',
  templateUrl: './stored-codes.page.html',
  styleUrls: ['./stored-codes.page.scss'],
})
export class StoredCodesPage implements OnInit {
  passports: any[] = [];

  constructor(private passportService: PassportService) {}

  ngOnInit() {
    this.loadPassports();
  }

  loadPassports() {
    this.passportService.getPassports().subscribe(
      (data: any) => {
        this.passports = data.data as any[]; 
      },
      error => {
        console.error('Error fetching passport data', error);
      }
    );
  }
  
  
}
