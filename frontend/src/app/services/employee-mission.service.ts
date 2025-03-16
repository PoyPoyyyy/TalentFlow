import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMissionService {
  private apiUrl = 'http://localhost:3000/api/employees-mission-stats';

  constructor(private http: HttpClient) {}

  getEmployeeMissionStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
