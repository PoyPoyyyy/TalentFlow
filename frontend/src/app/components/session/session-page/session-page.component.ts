import {Component, ViewChild} from '@angular/core';
import {EmployeeListComponent} from '../../employee/employee-list/employee-list.component';
import {SessionListComponent} from '../session-list/session-list.component';
import {RepliableContainerComponent} from '../../shared/repliable-container/repliable-container.component';
import {SessionFormAddComponent} from '../session-form-add/session-form-add.component';

@Component({
  selector: 'app-session-page',
  imports: [
    RepliableContainerComponent,
    SessionListComponent,
    SessionFormAddComponent
  ],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.css'
})
export class SessionPageComponent {
  @ViewChild(SessionListComponent) employeeList!: EmployeeListComponent;

  /*
   * Méthode appelée lorsqu'un employé est ajouté.
   * Cette méthode recharge la liste des employés en appelant la méthode `loadEmployees` de `EmployeeListComponent`.
   * @input : aucun
   * @output : aucun
   */
  onEmployeeAdded(): void {
    this.employeeList.loadEmployees();
  }
}
