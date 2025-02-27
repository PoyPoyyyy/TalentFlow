import { Component } from '@angular/core';
import {Employee} from '../../../models/employees.model';
import {EmployeeService} from '../../../services/employee/employee.service';
import {SweetMessageService} from '../../../services/sweet-message.service';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-session-list',
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  saveQuery: string = '';
  filterType: string = 'all';
  sortColumn: string = 'last_name';
  sortDirection: number = 1;

  constructor(
    private employeeService: EmployeeService,
    private sweetMessageService: SweetMessageService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /*
   * Charge la liste des employés depuis l'API et la trie par défaut.
   * @input : aucun
   * @output : aucun
   */
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
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

  /*
   * Filtre les employés en fonction de la requête de recherche et du type de filtre sélectionné.
   * @input : aucun
   * @output : aucun
   */
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

  /*
   * Trie les employés par une colonne donnée et dans un ordre spécifique.
   * @input : column (string) - La colonne sur laquelle trier les employés.
   *         toggle (boolean) - Indique si le tri doit être inversé ou non.
   * @output : aucun
   */
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

  /*
   * Ouvre une boîte de dialogue pour confirmer la suppression d'un employé.
   * @input : employee (Employee) - L'employé à supprimer.
   * @output : aucun
   */
  onDelete(employee: Employee): void {
    this.sweetMessageService
      .showAlert(
        'Confirm Deletion',
        `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`,
        'warning',
        true,
        'Delete',
        'Cancel'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.confirmDelete(employee.id);
        }
      });
  }

  /*
   * Confirme la suppression d'un employé en appelant l'API.
   * @input : employeeId (number) - L'identifiant de l'employé à supprimer.
   * @output : aucun
   */
  confirmDelete(employeeId: number): void {
    this.saveQuery = this.searchQuery;
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response) => {
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
