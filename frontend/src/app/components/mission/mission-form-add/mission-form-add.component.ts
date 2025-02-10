import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Mission, Skill } from '../../../models/employees.model';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';

@Component({
  selector: 'app-mission-form-add',
  imports: [ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './mission-form-add.component.html',
  styleUrl: './mission-form-add.component.css'
})
export class MissionFormAddComponent implements OnInit {

  
  missionForm: FormGroup;
  skills: {skill: Skill, quantity: number}[] = [];
  @Output() missionAdded = new EventEmitter<Mission>();

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.missionForm = this.formBuilder.group({
      name: '',
      description: '',
      start_date: '',
      duration: '',
      status: 'preparation',
      skills: []
    });
  }

  ngOnInit(): void {
    
  }

  onSkillsChange(skills: {skill: Skill, quantity: number}[]) {
    this.skills = skills;
    this.missionForm.patchValue({ skills: this.skills });
  }

  onSubmit(): void {
    const missionData = this.missionForm.value;
    console.log(missionData);

  this.http.post<Mission>('http://localhost:3000/api/missions', missionData)
    .subscribe({
      next: (response: Mission) => {
        this.missionForm.reset();
        this.missionAdded.emit(response);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la mission :', err);
        alert('Une erreur s\'est produite lors de l\'ajout de la mission.');
      }
    });
  }

  

}
