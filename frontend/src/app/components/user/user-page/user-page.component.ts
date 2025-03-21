import { Component, OnInit } from '@angular/core';
import {Employee, Mission} from '../../../models/employees.model';
import {AuthentificationService} from '../../../services/login/authentification.service';
import {MissionService} from '../../../services/mission/mission.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-page',
  imports: [DatePipe],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  currentEmployee!: Employee;
  missions: Mission[] = [];

  constructor(
    private authService: AuthentificationService,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.currentEmployee = this.authService.currentUser;
    if (this.currentEmployee) {
      this.loadMissions();
    }
  }

  /*
   * Charge les missions de l'employé connecté.
   * Appelle le service MissionService pour récupérer les missions attribuées à l'employé.
   * @input  : Aucun
   * @output : Affecte le tableau des missions à la propriété `missions`.
   */
  loadMissions(): void {
    this.missionService.getMissionsByEmployeeId(this.currentEmployee.id).subscribe({
      next: (missions: Mission[]) => this.missions = missions,
      error: (err) => console.error('Erreur lors du chargement des missions', err)
    });
  }
}
