import { Component, OnInit } from '@angular/core';
import { PassportService } from '../services/passport.service';

@Component({
  selector: 'app-stored-codes',
  templateUrl: './stored-codes.page.html',
  styleUrls: ['./stored-codes.page.scss'],
})
export class StoredCodesPage implements OnInit {
  passports: any[] = [];
  loading = false;
  error = false;
  errorText = "";

  constructor(private passportService: PassportService) {}

  ionViewWillEnter() {
    this.loadPassports();
  }
  ngOnInit() {
    this.loadPassports();
  }

  loadPassports() {
    this.loading = true;
    this.error = false;
    this.passportService.getPassports().subscribe(
      (res: any) => {
        console.log("Response from backend:", res);
        if (res.success) {
          this.passports = res.data;
          console.log("Passports loaded:", this.passports);
        } else {
          console.error("Invalid response format:", res);
          this.error = true;
        }
        this.loading = false; 
      },
      error => {
        console.error("Error loading passports:", error);
        this.error = true;
        this.loading = false;
        this.errorText = JSON.stringify(error);
      }
    );
  }
  
  
}
