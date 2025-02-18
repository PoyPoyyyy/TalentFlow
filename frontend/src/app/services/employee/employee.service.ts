import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employees.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeesUrl}/${id}`);
  }

  addEmployee(employeeData: FormData): Observable<any> {
    return this.http.post(this.employeesUrl, employeeData);
  }

  updateEmployee(id: number, employeeData: any): Observable<any> {
    return this.http.put(`${this.employeesUrl}/${id}`, employeeData);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.employeesUrl}/${id}`, { responseType: 'json' });
  }
}
