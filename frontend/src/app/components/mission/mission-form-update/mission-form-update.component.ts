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
  selectedEmployeesId: number[] = [];
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
      employees: []
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
  
        const uniqueSkills = mission.skills.reduce((acc, skill) => {
          if (!acc.some(s => s.code === skill.code)) {
            acc.push(skill);
          }
          return acc;
        }, [] as { code: number, description: string, quantity: number }[]);
  
        this.skills = uniqueSkills.map(skill => ({
          skill: { code: String(skill.code), description: skill.description },
          quantity: skill.quantity
        }));
  
        // Pré-sélectionner les employés dans selectedEmployeesId
        this.selectedEmployeesId = mission.employees.map(emp => emp.id);  // S'assurer que ce sont des IDs d'employés
  
        this.missionForm.patchValue({
          name: mission.name,
          description: mission.description,
          start_date: mission.start_date,
          duration: mission.duration,
          status: mission.status,
          skills: this.skills,
          employees: this.selectedEmployeesId  // Mettre à jour le champ employees avec les IDs sélectionnés
        });
  
      }, error => {
        console.error("Erreur lors du chargement de la mission:", error);
      });
  }
  
  

  onSubmit(): void {
    const startDate = new Date(this.missionForm.get('start_date')?.value); // Récupère la date du formulaire
  
    // Formatage de la date en ISO sans l'heure (ex: YYYY-MM-DD)
    const formattedStartDate = startDate.toLocaleDateString('fr-CA');
  
    const missionData = {
      name: this.missionForm.get('name')?.value,
      description: this.missionForm.get('description')?.value,
      start_date: formattedStartDate,
      duration: this.missionForm.get('duration')?.value,
      status: this.missionForm.get('status')?.value,
      skills: this.missionForm.get('skills')?.value,
      employees: this.selectedEmployeesId.map(id => 
        this.employees.find(emp => emp.id === id)
      ).filter(emp => emp !== undefined)
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

    }

    toggleEmployeeSelection(employeeId: number, event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
    
      if (isChecked) {
        // Ajouter l'ID si la case est cochée et n'est pas déjà dans la liste
        if (!this.selectedEmployeesId.includes(employeeId)) {
          this.selectedEmployeesId.push(employeeId);
        }
      } else {
        // Supprimer l'ID si la case est décochée
        this.selectedEmployeesId = this.selectedEmployeesId.filter(id => id !== employeeId);
      }
    
      // Supprimer les doublons en filtrant les IDs
      this.selectedEmployeesId = this.selectedEmployeesId.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    
      console.log('Employés sélectionnés :', this.selectedEmployeesId);
    }
    

    
}
