import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { EmployeeMissionService } from '../../../services/employee-mission.service';

@Component({
  selector: 'app-employee-mission-chart',
  templateUrl: './employee-mission-chart.component.html',
  styleUrls: ['./employee-mission-chart.component.css']
})
export class EmployeeMissionChartComponent implements OnInit {
  constructor(private employeeMissionService: EmployeeMissionService) {}

  ngOnInit(): void {
    this.employeeMissionService.getEmployeeMissionStats().subscribe(data => {
      const employeesWithMission = data.total - data.withoutMission;
      const employeesWithoutMission = data.withoutMission;

      this.createChart(employeesWithMission, employeesWithoutMission);
    });
  }

  createChart(withMission: number, withoutMission: number): void {
    new Chart('employeeMissionChart', {
      type: 'doughnut',
      data: {
        labels: ['Avec mission', 'Sans mission'],
        datasets: [{
          data: [withMission, withoutMission],
          backgroundColor: ['#4CAF50', '#FF5252'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
