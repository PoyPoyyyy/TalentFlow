import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../../models/employees.model';

@Component({
  selector: 'app-employee-card',
  imports: [],
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css']
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() employeeDeleted = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  onDelete(): void {
    this.http.delete(`http://localhost:3000/api/employees/${this.employee.id}`, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Réponse de suppression:', response);
          this.employeeDeleted.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'employé:', error);
        }
      });
  }

}
