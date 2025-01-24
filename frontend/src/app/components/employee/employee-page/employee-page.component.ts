import {Component, ViewChild} from '@angular/core';
import {EmployeeListComponent} from '../employee-list/employee-list.component';
import {RepliableContainerComponent} from '../../shared/repliable-container/repliable-container.component';
import {EmployeeFormAddComponent} from '../employee-form-add/employee-form-add.component';

@Component({
  selector: 'app-employee-page',
  imports: [EmployeeListComponent, RepliableContainerComponent, EmployeeFormAddComponent],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})
export class EmployeePageComponent {
  @ViewChild(EmployeeListComponent) employeeList!: EmployeeListComponent;
  onEmployeeAdded(): void {
    this.employeeList.loadEmployees();
  }
}
