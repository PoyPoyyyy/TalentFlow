import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../../services/log/logs.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-log-page',
  imports: [DatePipe],
  templateUrl: './log-page.component.html',
  styleUrl: './log-page.component.css'
})
export class LogPageComponent implements OnInit {
  logs: any[] = [];
  currentPage: number = 1;
  logsPerPage: number = 10;
  totalLogs: number = 0;

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.loadLogs();
    this.loadTotalLogs();
  }

  /*
  * Charge les logs pour la page courante
  * @output : aucun
  * @input : aucun
  */
  loadLogs(): void {
    this.logsService.getLogs(this.currentPage, this.logsPerPage).subscribe((data) => {
      this.logs = data;
    });
  }

  /*
  * Charge le nombre total de logs pour gérer la pagination
  * @input : aucun
  * @output : aucun
  */
  loadTotalLogs(): void {
    this.logsService.getLogsCount().subscribe((count: any) => {
      this.totalLogs = count.total;
    });
  }

  /*
  * Change de page et recharge les logs
  * @input : page (number) - La page à charger
  * @output : aucun
  */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadLogs();
  }

  /*
  * Calcule le nombre total de pages pour la pagination
  * @input : aucun
  * @output : number - Le nombre total de pages
  */
  totalPages(): number {
    return Math.ceil(this.totalLogs / this.logsPerPage);
  }
}
