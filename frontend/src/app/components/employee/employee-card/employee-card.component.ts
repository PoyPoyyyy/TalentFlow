import { Component, Input } from '@angular/core';
import { Employee } from '../../../models/employees.model';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
  imports: []
})

export class EmployeeCardComponent{
  @Input() employee!: Employee;
}
