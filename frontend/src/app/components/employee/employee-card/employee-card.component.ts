import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../../models/employees.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() employeeDeleted = new EventEmitter<void>();

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  onDelete(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmDelete();
      }
    });
  }

  private confirmDelete(): void {
    this.http.delete(`http://localhost:3000/api/employees/${this.employee.id}`, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.employeeDeleted.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'employé:', error);
        },
      });
  }
}
