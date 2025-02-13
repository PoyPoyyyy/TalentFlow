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
          // Si la mission est passée et que son statut n'est pas encore 'ongoing', on le met à jour
          mission.status = 'ongoing';

          // Mettre à jour le statut de la mission dans la base de données
          this.updateMissionStatus(mission);
        }

        /*const endDate = new Date(missionDate); // Crée une nouvelle date basée sur la date de début
        endDate.setUTCDate(missionDate.getUTCDate() + mission.duration); // Ajoute la durée à la date de début en UTC
        
        // Vérifier si la date de fin dépasse aujourd'hui
        if (endDate > today) {
          mission.status = 'completed'; // Mettre à jour le statut si la mission est terminée
          this.updateMissionStatus(mission);
        }*/
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

     console.table(updatedMission);

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


    console.table(this.missionsList);
  }


  onUpdate(mission: Mission): void {
    this.missionUpdated.emit(mission);
  }

}
