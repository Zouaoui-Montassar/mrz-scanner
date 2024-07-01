import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Http,HttpOptions } from '@capacitor-community/http';
import { request } from 'http';



@Injectable({
  providedIn: 'root'
})
export class PassportService {
  private apiUrl = 'http://localhost:8200/passports';

  constructor(private http: HttpClient) { }
/* 
  addPassport(passportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, passportData);
  } */

  getPassports() {
    const requestURL = `${this.apiUrl}/get`;
    const options : HttpOptions = {
      url : requestURL,
    };
    return from (Http.get(options));
  }
  addPassport(passportData: any): Observable<any> {
    const requestURL = `${this.apiUrl}/add`;
    const options: HttpOptions = {
      url: requestURL,
      method: 'POST',
      data: passportData, 
      headers: {
        'Content-Type': 'application/json' 
      }
    };
    console.log("Data to be added:", passportData);
    return from(Http.post(options));
  }
}
