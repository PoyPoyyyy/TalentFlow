import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-employee-card',
  imports: [
    DatePipe
  ],
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css']
})
export class EmployeeCardComponent {
  @Input() employee: any;
}
