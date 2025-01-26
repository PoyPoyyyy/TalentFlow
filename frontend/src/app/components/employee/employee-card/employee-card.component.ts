import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../../models/employees.model';
import { SweetMessageService } from '../../../services/sweet-message.service';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
  imports: [
    DatePipe,
    RouterLink
  ]
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() employeeDeleted = new EventEmitter<void>();
  @Output() editEmployee = new EventEmitter<number>();
  constructor(private http: HttpClient, private sweetMessageService: SweetMessageService) {}

  onDelete(): void {
    this.sweetMessageService.showAlert('Confirm Deletion', 'Are you sure you want to delete this employee?', 'info', true, 'Delete', 'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        console.log('Delete confirmed');
        console.log(result);
        this.confirmDelete();
      }
    });
  }

  private confirmDelete(): void {
    this.http.delete(`http://localhost:3000/api/employees/${this.employee.id}`, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.employeeDeleted.emit();
          this.sweetMessageService.showToast('Employee deleted successfully.', 'success');
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.sweetMessageService.showToast('An error occurred while deleting the employee.', 'error');
        },
      });
  }
}
