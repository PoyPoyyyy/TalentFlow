import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employees.model';
import { FormsModule } from '@angular/forms';
import {SweetMessageService} from '../../../services/sweet-message.service';

@Component({
  selector: 'app-employee-list',
  imports: [EmployeeCardComponent, CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  private saveQuery: string = '';

  constructor(private http: HttpClient, private sweetMessageService : SweetMessageService) {}  // Injection du service

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<Employee[]>('http://localhost:3000/api/employees')
      .subscribe((employees: Employee[]) => {
        this.employees = employees;
        this.filteredEmployees = [...this.employees];
      });
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) =>
      employee.first_name.toLowerCase().includes(query) ||
      employee.last_name.toLowerCase().includes(query)
    );
  }

  onEmployeeDeleted(): void {
    this.saveQuery = this.searchQuery;
    this.loadEmployees();
    setTimeout(() => {
      this.searchQuery = this.saveQuery;
      this.filterEmployees();
    }, 150);
    this.sweetMessageService.showToast('Employee deleted successfully!', 'success');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterEmployees();
  }
}
