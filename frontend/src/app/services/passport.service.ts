import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environementVARS';


@Injectable({
  providedIn: 'root'
})
export class PassportService {
  private apiUrl = environment.apiUrl; // 10.0.2.2 => ip address of the emulator

  constructor(private http: HttpClient) { }

  getPassports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }

  addPassport(passportData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${this.apiUrl}/add`, passportData, httpOptions);
  }
}
