import { Component, OnInit } from '@angular/core';
import { Employee, Mission, Skill } from '../../../models/employees.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';

@Component({
  selector: 'app-mission-form-update',
  imports: [FormsModule, ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './mission-form-update.component.html',
  styleUrl: './mission-form-update.component.css'
})

export class MissionFormUpdateComponent implements OnInit {

  employees: Employee[] = [];
  mission!: Mission;
  missionForm: FormGroup;
  skills: {skill: Skill, quantity: number}[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private formBuilder: FormBuilder,) {
    this.missionForm = this.formBuilder.group({
      name: '',
      description: '',
      start_date: '',
      duration: '',
      status: '',
      skills: [],
      employees: ''
    });
  }

  ngOnInit(): void {
    this.http.get<Employee[]>('http://localhost:3000/api/employees').subscribe((employees) => this.employees = employees);
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadMission(id);
    }

  }

  loadMission(id: string): void {
    this.http.get<Mission>(`http://localhost:3000/api/missions/${id}`)
      .subscribe(mission => {
        this.mission = mission;

        this.missionForm.patchValue({
          name: mission.name,
          description: mission.description,
          start_date: mission.start_date,
          duration: mission.duration,
          status: mission.status,
          skills: mission.skills,
          employees: mission.employees
        });

        
        this.skills = mission.skills.map(skill => ({
          skill: { code: String(skill.code), description: skill.description },
          quantity: skill.quantity
        }));

        


      }, error => {
        console.error("Erreur lors du chargement de la mission:", error);
      });
  }

  onSubmit(): void {
      const missionData = {
        name: this.missionForm.get('name')?.value,
        description: this.missionForm.get('description')?.value,
        start_date: this.missionForm.get('start_date')?.value,
        duration: this.missionForm.get('duration')?.value,
        status: this.missionForm.get('status')?.value,
        skills: this.missionForm.get('skills')?.value,
        employees: [this.employees.find(emp => emp.id === this.missionForm.get('employees')?.value)]
      };

  
      this.http.put(`http://localhost:3000/api/missions/${this.mission.id}`, missionData)
        .pipe(
          catchError((error) => {
            console.error('Error occurred:', error);
            return throwError(error);
          })
        )
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/mission-page');
          }
        });
    }

    onSkillsChange(skills: {skill: Skill, quantity: number}[]) {
        this.skills = skills;
        this.missionForm.patchValue({ skills: this.skills });

        console.table([this.employees.find(emp => emp.id === this.missionForm.get('employees')?.value)]);
    }
}
