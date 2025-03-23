import { Component } from '@angular/core';
import {EmployeeMissionChartComponent} from '../employee-mission-chart/employee-mission-chart.component';
import {MissionStatusChartComponent} from '../mission-status-chart/mission-status-chart.component';

@Component({
  selector: 'app-welcome-page',
  imports: [
    EmployeeMissionChartComponent,
    MissionStatusChartComponent
  ],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})

export class WelcomePageComponent {

}
