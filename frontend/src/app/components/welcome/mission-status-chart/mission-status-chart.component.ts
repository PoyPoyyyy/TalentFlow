import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MissionService } from '../../../services/mission/mission.service';

@Component({
  selector: 'app-mission-status-chart',
  templateUrl: './mission-status-chart.component.html',
  styleUrls: ['./mission-status-chart.component.css']
})
export class MissionStatusChartComponent implements OnInit {
  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.missionService.getMissionStatusStats().subscribe(data => {
      console.log('Données reçues :', data); // Vérification

      // On crée un objet pour stocker le nombre de missions par statut
      const missionCounts: { [key: string]: number } = {
        preparation: 0,
        planned: 0,
        ongoing: 0,
        completed: 0
      };

      // On compte les missions par statut
      data.forEach((mission: any) => {
        if (missionCounts.hasOwnProperty(mission.status)) {
          missionCounts[mission.status]++;
        }
      });

      console.log('Données transformées :', missionCounts); // Vérification après comptage

      // On extrait les labels et les valeurs
      const labels = Object.keys(missionCounts);
      const counts = Object.values(missionCounts);

      this.createChart(labels, counts);
    });
  }

  createChart(labels: string[], counts: number[]): void {
    new Chart('missionStatusChart', {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de missions',
          data: counts,
          backgroundColor: ['blue', 'orange', 'green', 'gray']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
