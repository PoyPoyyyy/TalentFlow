import { Component } from '@angular/core';
import {EmployeeListComponent} from '../employee-list/employee-list.component';
import {RepliableContainerComponent} from '../../shared/repliable-container/repliable-container.component';
import {SearchBarComponent} from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-employee-page',
  imports: [
    EmployeeListComponent,
    RepliableContainerComponent,
    SearchBarComponent
  ],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})
export class EmployeePageComponent {
  searchQuery: string = '';
  onSearch(query: string) {
    this.searchQuery = query;
  }
}
