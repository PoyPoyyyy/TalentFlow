import { Component, OnInit } from '@angular/core';
import { Employee, Mission, Skill } from '../../../models/employees.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import {LogsService} from '../../../services/log/logs.service';
import {AuthentificationService} from '../../../services/login/authentification.service';

@Component({
  selector: 'app-mission-form-update',
  imports: [FormsModule, ReactiveFormsModule, MultiSelectComponent, CommonModule],
  templateUrl: './mission-form-update.component.html',
  styleUrl: './mission-form-update.component.css'
})

export class MissionFormUpdateComponent implements OnInit {

  missionId!: number;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployeesId: number[] = [];
  mission!: Mission;
  missions: Mission[] = [];
  missionForm: FormGroup;
  skills: {skill: Skill, quantity: number}[] = [];
  skillsAllocation: { [key: string]: number } = {};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private missionService: MissionService,
              private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private logsService: LogsService,
              private authService: AuthentificationService) {
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
    this.missionId = this.route.snapshot.params['id'];
    if (!this.missionId) return;

    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;

      this.loadMission(this.missionId);
      this.loadMissions();



    }, error => {
      console.error("Erreur lors du chargement des employés:", error);
    });
  }


  loadMissions(): void {

    this.missionService.getMissions().subscribe(missions => {
      this.missions = missions;
      this.filterEmployees();

    }, error => {
      console.error("Erreur lors du chargement des missions:", error);
    });


  }



  filterEmployees(): void {
    if (!this.mission) {
      console.log("mission pas chargée !");
      return;
    };

    // Filtrer les employés qui ont les compétences requises
    this.filteredEmployees = this.employees.filter(employee =>
      employee.skills.some(empSkill =>
        this.skills.some(skill => empSkill.code === skill.skill.code)
      )
    );

    const assignedEmployees: Employee[] = [];
    this.missions.forEach(mission => {
      if (mission.employees) {
        mission.employees.forEach(emp => {

            if (this.mission.id !== mission.id && this.filteredEmployees.some(e => e.id === emp.id)) {
              assignedEmployees.push(emp);
            }


        })
      }

    })

    console.log("Assigned : ");
    console.log(assignedEmployees);

    this.filteredEmployees = this.filteredEmployees.filter(employee =>
      !assignedEmployees.some(assignedEmp => assignedEmp.id === employee.id)
    );








  }






  onSubmit(): void {
    if (this.skills.length === 0) {
        alert("La mission doit avoir au moins une compétence !");
        return;
    }

    if (this.selectedEmployeesId.length === 0 && this.mission.status !== 'preparation') {
        alert("La mission doit avoir au moins un employé !");
        return;
    }

    const startDate = new Date(this.missionForm.get('start_date')?.value);
    const formattedStartDate = startDate.toLocaleDateString('fr-CA');

    const skills = this.missionForm.get('skills')?.value;
    const employees = this.selectedEmployeesId.map(id =>
        this.employees.find(emp => emp.id === id)
    ).filter(emp => emp !== undefined);

    const missionData = {
        name: this.missionForm.get('name')?.value,
        description: this.missionForm.get('description')?.value,
        start_date: formattedStartDate,
        duration: this.missionForm.get('duration')?.value,
        status: this.missionForm.get('status')?.value,
        skills: skills,
        employees: employees
    };

    this.missionService.updateMission(this.mission.id, missionData)
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
    const logMessage = `Mission updated : ${missionData.name}`;

    this.logsService.createLog(
      this.authService.currentUser.id,
      'Update - mission',
      logMessage
    ).subscribe(() => {});
}





onSkillsChange(skills: { skill: Skill, quantity: number }[]) {
  this.skills = skills;
  this.missionForm.patchValue({ skills: this.skills });

  this.filterEmployees();

  this.removeUnqualifiedEmployees();

  this.updateSkillsAllocation();
}

removeUnqualifiedEmployees(): void {
  this.selectedEmployeesId = this.selectedEmployeesId.filter(employeeId => {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (!employee) return false;

    const hasRequiredSkill = employee.skills.some(empSkill =>
      this.skills.some(skill => empSkill.code === skill.skill.code)
    );

    return hasRequiredSkill;
  });

  console.log('Employés après suppression des non qualifiés:', this.selectedEmployeesId);
}



    loadMission(id: number): void {
      this.missionService.getMissionById(id)
        .subscribe(mission => {
          this.mission = mission;

          const uniqueSkills = mission.skills.reduce((acc, skill) => {
            if (!acc.some(s => s.skill.code === skill.skill.code)) {
              acc.push(skill);
            }
            return acc;
          }, [] as { skill: Skill, quantity: number }[]);

          this.skills = uniqueSkills.map(skillInfos => ({

            skill: { code: skillInfos.skill.code, description: skillInfos.skill.description },
            quantity: skillInfos.quantity
          }));

          this.selectedEmployeesId = mission.employees ? [...new Set(mission.employees.map(emp => emp.id))] : [];


          this.updateSkillsAllocation();

          this.missionForm.patchValue({
            name: mission.name,
            description: mission.description,
            start_date: mission.start_date,
            duration: mission.duration,
            status: mission.status,
            skills: this.skills,
            employees: this.selectedEmployeesId
          });

          this.filterEmployees();


        }, error => {
          console.error("Erreur lors du chargement de la mission:", error);
        });
    }

    toggleEmployeeSelection(employeeId: number, event: Event): void {
      const checkbox = event.target as HTMLInputElement;
      const isChecked = checkbox.checked;
      const employee = this.employees.find(emp => emp.id === employeeId);

      if (!employee) return;

      if (isChecked) {
        if (!this.selectedEmployeesId.includes(employeeId)) {
          this.selectedEmployeesId.push(employeeId);
        }
      } else {
        this.selectedEmployeesId = this.selectedEmployeesId.filter(id => id !== employeeId);
      }

      this.updateSkillsAllocation();

      console.log('Employés sélectionnés:', this.selectedEmployeesId);
      console.log('Répartition des compétences:', this.skillsAllocation);
    }

    updateSkillsAllocation(): void {
      this.skillsAllocation = {};

      this.selectedEmployeesId.forEach(employeeId => {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee) {
          employee.skills.forEach(skill => {
            this.skillsAllocation[skill.code] = (this.skillsAllocation[skill.code] || 0) + 1;
          });
        }
      });

      console.log("Répartition mise à jour des compétences :", this.skillsAllocation);
    }

    getSkillClass(skill: { skill: Skill, quantity: number }): any {
      const allocatedEmployees = this.skillsAllocation[skill.skill.code] || 0;
      const isSufficient = allocatedEmployees >= skill.quantity;
      return {
        'has-skill': isSufficient,
        'missing-skill': !isSufficient
      };
    }





}
