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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.loadMissions();
  }

  loadMissions(): void {
    
      this.http.get<Mission[]>('http://localhost:3000/api/missions')
        .subscribe((missions: Mission[]) => {
          this.missionsList = missions;
          this.missionsSelected = [...this.missionsList];
          console.table(this.missionsList);
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


  onUpdate(): void {

  }

}
