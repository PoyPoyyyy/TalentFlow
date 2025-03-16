import { Component } from '@angular/core';
import {EmployeeMissionChartComponent} from '../employee-mission-chart/employee-mission-chart.component';

@Component({
  selector: 'app-welcome-page',
  imports: [
    EmployeeMissionChartComponent
  ],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})

export class WelcomePageComponent {

}
