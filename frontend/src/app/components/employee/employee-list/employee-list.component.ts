import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employees.model';

@Component({
  selector: 'app-employee-list',
  imports: [
    EmployeeCardComponent,
    CommonModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  @Input() searchQuery: string = '';
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get<Employee[]>('http://localhost:3000/api/employees')
      .subscribe((employees: Employee[]) => {
        this.employees = employees;
        this.filteredEmployees = [...this.employees];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      const query = this.searchQuery.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee =>
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
      );
    }
  }
  reloadEmployees(): void {
    this.http.get<Employee[]>('http://localhost:3000/api/employees')
      .subscribe((employees: Employee[]) => {
        this.employees = employees;
        this.filteredEmployees = [...this.employees];
      });
  }


}
