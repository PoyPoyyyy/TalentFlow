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
  filterType: string = 'all';
  sortColumn: string = 'last_name';
  sortDirection: number = 1;

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
        this.sortEmployees('last_name');
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      },
    });
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) => {
      if (this.filterType === 'first-name') {
        return employee.first_name.toLowerCase().includes(query);
      } else if (this.filterType === 'last-name') {
        return employee.last_name.toLowerCase().includes(query);
      } else {
        return (
          employee.first_name.toLowerCase().includes(query) ||
          employee.last_name.toLowerCase().includes(query)
        );
      }
    });
    this.sortEmployees(this.sortColumn, false);
  }

  sortEmployees(column: string, toggle: boolean = true): void {
    if (!Object.keys(this.employees[0] ?? {}).includes(column)) return;
    const key = column as keyof Employee;

    if (toggle) {
      this.sortDirection = this.sortColumn === key ? -this.sortDirection : 1;
    }
    this.sortColumn = key;

    this.filteredEmployees.sort((a, b) => {
      let valueA = a[key] as string | number;
      let valueB = b[key] as string | number;

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return -1 * this.sortDirection;
      if (valueA > valueB) return 1 * this.sortDirection;
      return 0;
    });
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
