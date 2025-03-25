import { Component, OnInit } from '@angular/core';
import { EmployeeMissionService } from '../../../services/employee-mission.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {ReactiveFormsModule} from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-employee-mission-chart',
  templateUrl: './employee-mission-chart.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./employee-mission-chart.component.css']
})
export class EmployeeMissionChartComponent implements OnInit {
  totalEmployees: number = 0;
  totalMissions: number = 0;
  constructor(private employeeMissionService: EmployeeMissionService) {}

  ngOnInit(): void {
    this.loadChart();
    this.employeeMissionService.getTotalEmployees().subscribe(data => {
      this.totalEmployees = data.totalEmployees;
    });
  }

  loadChart(): void {
    this.employeeMissionService.getEmployeeMissionStats().subscribe(data => {
      const ctx = document.getElementById('employeeMissionChart') as HTMLCanvasElement;
      if (!ctx) return;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Avec mission', 'Sans mission'],
          datasets: [{
            data: [data.withMission, data.withoutMission],
            backgroundColor: ['#4bc0ae', '#f17e64']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Statut des employées',
            }
          }
        }
      });
    }, error => {
      console.error('Erreur lors de la récupération des statistiques', error);
    });
  }
}
