import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Mission } from '../../../models/employees.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MissionService } from '../../../services/mission/mission.service';
import {LogsService} from '../../../services/log/logs.service';
import {AuthentificationService} from '../../../services/login/authentification.service';

@Component({
  selector: 'app-mission-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './mission-list.component.html',
  styleUrl: './mission-list.component.css'
})
export class MissionListComponent implements OnInit {

  searchQuery: string = '';
  missionsList: Mission[] = [];
  missionsSelected: Mission[] = [];
  @Output() missionDeleted = new EventEmitter<void>();
  @Output() missionUpdated = new EventEmitter<Mission>();


  constructor(private missionService: MissionService,
              private logsService: LogsService,
              private authService: AuthentificationService) {}

  ngOnInit(): void {
      this.loadMissions();
  }

  loadMissions(): void {
    
    this.missionService.getMissions().subscribe((missions: Mission[]) => {
    this.missionsList = missions.map(mission => {
      if (!mission.employees) {
        mission.employees = [];
      } else {
        mission.employees = mission.employees.filter(employee => employee.first_name != null);

      }

      if (mission.start_date) {
        const missionDate = new Date(mission.start_date);

        
       
      
        const today = new Date();
        if (missionDate < today && mission.status !== 'ongoing') {
          mission.status = 'ongoing';
          this.updateMissionStatus(mission);
        }
      
        if (mission.employees.length > 0 && mission.status === 'preparation') {
          mission.status = 'planned';
          this.updateMissionStatus(mission);
        }
      
        const endDate = new Date(missionDate);
        endDate.setDate(endDate.getDate() + mission.duration);
      
        if (endDate < today && mission.status !== 'completed') {
          mission.status = 'completed';
          this.updateMissionStatus(mission);
        }
      }
      


      return mission;
    });

    this.missionsSelected = [...this.missionsList];
  });

  }

  updateMissionStatus(mission: Mission): void {

    const updatedMission = { name: mission.name,
                            description: mission.description,
                            start_date: mission.start_date,
                            duration: mission.duration,
                            status: mission.status,
                            skills: mission.skills,
                            employees: mission.employees
     };


    this.missionService.updateMission(mission.id, updatedMission)
      .subscribe({
        next: () => {
          console.log(`Mission ${mission.id} mise à jour avec succès`);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut de la mission:', error);
        }
      });
  }


  onDelete(mission: Mission): void {
    this.missionService.deleteMission(mission.id).subscribe({
        next: (response) => {
          console.log('Réponse de suppression:', response);
          this.missionDeleted.emit();
          this.loadMissions();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la mission:', error);
        }
    });
    const logMessage = `Mission deleted : ${mission.name}`;

    this.logsService.createLog(
      this.authService.currentUser.id,
      'Delete - mission',
      logMessage
    ).subscribe(() => {});
  }

  getMissionsSelected(): void {
    const query = this.searchQuery.toLowerCase();
    this.missionsSelected = this.missionsList.filter(mission =>
      mission.name.toLowerCase().includes(query) ||
      mission.description.toLowerCase().includes(query) ||
      mission.duration.toString().includes(query) ||
      mission.status.toLowerCase().includes(query) ||
      mission.skills.some(skillObj =>
        skillObj.skill.code.toLowerCase().includes(query) ||
        skillObj.skill.description.toLowerCase().includes(query)
      ) ||
      mission.employees.some(employee =>
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
      )
    );


  }


  onUpdate(mission: Mission): void {
    this.missionUpdated.emit(mission);
  }

}







