import { Component, ViewChild } from '@angular/core';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { RepliableContainerComponent } from '../../shared/repliable-container/repliable-container.component';
import { EmployeeFormAddComponent } from '../employee-form-add/employee-form-add.component';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.css'],
  imports: [EmployeeListComponent, RepliableContainerComponent, EmployeeFormAddComponent]
})
export class EmployeePageComponent {
  @ViewChild(EmployeeListComponent) employeeList!: EmployeeListComponent;

  onEmployeeAdded(): void {
    this.employeeList.loadEmployees();
  }
}
