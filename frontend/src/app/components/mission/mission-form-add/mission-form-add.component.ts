import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Mission } from '../../../models/employees.model';

@Component({
  selector: 'app-mission-form-add',
  imports: [ReactiveFormsModule],
  templateUrl: './mission-form-add.component.html',
  styleUrl: './mission-form-add.component.css'
})
export class MissionFormAddComponent implements OnInit {

  missionForm: FormGroup;
  @Output() missionAdded = new EventEmitter<Mission>();

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.missionForm = this.formBuilder.group({
      name: '',
      description: '',
      start_date: '',
      duration: 0,
      status: 'preparation'
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    const missionData = this.missionForm.value;
  console.log(this.missionForm.value);

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
