import { Component } from '@angular/core';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [
    EmployeeCardComponent,
    CommonModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  employees = [
    {
      id: 1,
      firstName: 'firstName1',
      lastName: 'lastName1',
      hireDate: new Date(),
      skills: [
        { code: '', description: 'Skill1' },
        { code: '', description: 'Skill2' }
      ]
    },
    {
      id: 2,
      firstName: 'Janeee',
      lastName: 'Smith',
      hireDate: new Date(),
      skills: [
        { code: '', description: 'Skill1' },
        { code: '', description: 'Skill2' }
      ]
    }
  ];
}
