import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../../models/employees.model';
import { SweetMessageService } from '../../../services/sweet-message.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [RouterLink, DatePipe, FormsModule],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  saveQuery: string = '';

  constructor(
    private http: HttpClient,
    private sweetMessageService: SweetMessageService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<Employee[]>('http://localhost:3000/api/employees').subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.filteredEmployees = [...this.employees];
        this.filterEmployees();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      },
    });
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(
      (employee) =>
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
    );
  }

  onDelete(employee: Employee): void {
    this.sweetMessageService
      .showAlert('Confirm Deletion', `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`, 'warning', true, 'Delete', 'Cancel')
      .then((result) => {
        if (result.isConfirmed) {
          this.confirmDelete(employee.id);
        }
      });
  }

  private confirmDelete(employeeId: number): void {
    this.saveQuery = this.searchQuery;
    this.http
      .delete(`http://localhost:3000/api/employees/${employeeId}`, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.sweetMessageService.showToast('Employee deleted successfully.', 'success');
          this.loadEmployees();
          this.searchQuery = this.saveQuery;
          this.filterEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.sweetMessageService.showToast('An error occurred while deleting the employee.', 'error');
        },
      });
  }
}
