import { Component, ViewChild } from '@angular/core';
import { RepliableContainerComponent } from '../../shared/repliable-container/repliable-container.component';
import { MissionListComponent } from "../mission-list/mission-list.component";
import { MissionFormAddComponent } from '../mission-form-add/mission-form-add.component';

@Component({
  selector: 'app-mission-page',
  imports: [RepliableContainerComponent, MissionListComponent, MissionFormAddComponent],
  templateUrl: './mission-page.component.html',
  styleUrl: './mission-page.component.css'
})
export class MissionPageComponent {

  @ViewChild(MissionListComponent) missionList!: MissionListComponent;

  onMissionAdded(): void {
    this.missionList.loadMissions();
  }

}
