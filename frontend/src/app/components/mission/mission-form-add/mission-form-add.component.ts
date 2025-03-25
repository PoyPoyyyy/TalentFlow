import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Mission, Skill } from '../../../models/employees.model';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';
import { MissionService } from '../../../services/mission/mission.service';
import {LogsService} from '../../../services/log/logs.service';
import {AuthentificationService} from '../../../services/login/authentification.service';

@Component({
  selector: 'app-mission-form-add',
  imports: [ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './mission-form-add.component.html',
  styleUrl: './mission-form-add.component.css'
})
export class MissionFormAddComponent {

  missionForm: FormGroup;
  skills: {skill: Skill, quantity: number}[] = [];
  @Output() missionAdded = new EventEmitter<Mission>();

  constructor(private formBuilder: FormBuilder, private missionService: MissionService,
              private logsService: LogsService,
              private authService: AuthentificationService) {
    this.missionForm = this.formBuilder.group({
      name: '',
      description: '',
      start_date: '',
      duration: '',
      status: 'preparation',
      skills: []
    });
  }

  /*
  * Met à jour la liste des compétences sélectionnées dans le formulaire de mission.
  * @input : skills ({ skill: Skill, quantity: number }[]) - Liste des compétences sélectionnées, 
  *         avec leur quantité respective.
  * @output : Aucun.
  */
  onSkillsChange(skills: {skill: Skill, quantity: number}[]): void {
    this.skills = skills;
    this.missionForm.patchValue({ skills: this.skills });
  }

  /*
  * Soumet le formulaire en envoyant une requête via `MissionService` pour ajouter la mission.
  * Crée un log via `LogsService` en cas de succès.
  * @input : Aucun.
  * @output : Aucun.
  */
  onSubmit(): void {
    const startDate = new Date(this.missionForm.get('start_date')?.value);
    const today = new Date();

    const startDateFormatted = startDate.toISOString().split('T')[0];
    const todayFormatted = today.toISOString().split('T')[0];

    if (startDateFormatted < todayFormatted) {
      alert("Erreur : La date de début ne peut pas être antérieure à aujourd'hui.");
      return;
    }

    if (this.skills.length === 0) {
      alert("Remplissez le champ 'skills', vous pourrez le modifier plus tard.");
      return;
    }

    const missionData = this.missionForm.value;

    this.missionService.addMission(missionData)
      .subscribe({
        next: (response: Mission) => {
          this.missionForm.reset();
          this.missionAdded.emit(response);
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout de la mission :", err);
          alert("Une erreur s'est produite lors de l'ajout de la mission.");
        }
      });
    const logMessage = `Mission added : ${missionData.name}`;

    this.logsService.createLog(
      this.authService.currentUser.id,
      'Add - mission',
      logMessage
    ).subscribe(() => {});
  }

}
