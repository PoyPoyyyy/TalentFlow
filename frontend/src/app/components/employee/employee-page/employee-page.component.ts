import {Component, ViewChild} from '@angular/core';
import {EmployeeListComponent} from '../employee-list/employee-list.component';
import {RepliableContainerComponent} from '../../shared/repliable-container/repliable-container.component';
import {SearchBarComponent} from '../../shared/search-bar/search-bar.component';
import {EmployeeFormAddComponent} from '../employee-form-add/employee-form-add.component';

@Component({
  selector: 'app-employee-page',
  imports: [
    EmployeeListComponent,
    RepliableContainerComponent,
    SearchBarComponent,
    EmployeeFormAddComponent
  ],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})
export class EmployeePageComponent {
  searchQuery: string = '';
  @ViewChild(EmployeeListComponent) employeeList!: EmployeeListComponent;
  onSearch(query: string) {
    this.searchQuery = query;
  }
  onEmployeeAdded(): void {
    this.employeeList.reloadEmployees();
  }
}
