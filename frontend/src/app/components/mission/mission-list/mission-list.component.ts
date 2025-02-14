import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mission } from '../../../models/employees.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.loadMissions();
  }

  checkAndUpdateMissionStatus(mission: Mission): Mission {
    const today = new Date();
    const startDate = new Date(mission.start_date);
    const endDate = new Date(mission.start_date);
    endDate.setDate(endDate.getDate() + mission.duration);

    let expectedStatus = mission.status;
    if (today >= endDate && mission.status !== 'completed') {
      expectedStatus = 'completed';
    }
    else if (today >= startDate && mission.status !== 'ongoing') {
      expectedStatus = 'ongoing';
    }
    else if (mission.employees && mission.employees.length > 0 && mission.status !== 'planned') {
      expectedStatus = 'planned';
    }
    if (expectedStatus !== mission.status) {
      mission.status = expectedStatus;
      this.updateMissionStatus(mission);
    }
    return mission;
  }

  loadMissions(): void {
    this.http.get<Mission[]>('http://localhost:3000/api/missions')
  .subscribe((missions: Mission[]) => {
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
        endDate.setUTCDate(missionDate.getUTCDate() + mission.duration); 
        
       
        if (endDate < today && mission.status!== 'completed') {
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


    this.http.put(`http://localhost:3000/api/missions/${mission.id}`, updatedMission)
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
    this.http.delete(`http://localhost:3000/api/missions/${mission.id}`, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Réponse de suppression:', response);
          this.missionDeleted.emit();
          this.loadMissions();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la mission:', error);
        }
    });
  }

  getMissionsSelected(): void {
    const query = this.searchQuery.toLowerCase();
    this.missionsSelected = this.missionsList.filter(mission =>
      mission.name.toLowerCase().includes(query) ||
      mission.description.toLowerCase().includes(query) ||
      mission.duration.toString().includes(query) ||
      mission.status.toLowerCase().includes(query)
    );


  }

  onUpdate(mission: Mission): void {
    this.missionUpdated.emit(mission);
  }

}
