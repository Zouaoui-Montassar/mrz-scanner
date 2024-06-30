import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassportService {
  private apiUrl = 'http://localhost:8200/passports';

  constructor(private http: HttpClient) { }

  addPassport(passportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, passportData);
  }

  getPassports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }
}
