import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';
import { SweetMessageService } from '../../../services/sweet-message.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-employee-form-update',
  templateUrl: './employee-form-update.component.html',
  styleUrls: ['./employee-form-update.component.css'],
  imports: [ReactiveFormsModule]
})
export class EmployeeFormUpdateComponent implements OnInit {
  employeeForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  employeeId: number;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private sweetMessageService: SweetMessageService,
    private router: Router
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      hireDate: ''
    });
    this.employeeId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
      .subscribe((skills) => this.skills = skills);
    this.loadEmployeeData();
  }

  /*
   * Charge les données d'un employé existant dans le formulaire en fonction de son ID.
   * @input : aucun
   * @output : aucun
   */
  loadEmployeeData(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe((employee: any) => {
      const hireDate = new Date(employee.hire_date).toISOString().split('T')[0];
      this.employeeForm.patchValue({
        firstName: employee.first_name,
        lastName: employee.last_name,
        hireDate: hireDate
      });
      this.selectedSkills = employee.skills.map((skill: any) => skill.code);
    });
  }

  /*
   * Gère l'ajout ou la suppression d'une compétence sélectionnée.
   * @input : skillCode (string) - Le code de la compétence à ajouter ou supprimer.
   * @output : aucun
   */
  toggleSkill(skillCode: string): void {
    if (this.selectedSkills.includes(skillCode)) {
      this.selectedSkills = this.selectedSkills.filter(code => code !== skillCode);
    } else {
      this.selectedSkills.push(skillCode);
    }
  }

  /*
   * Soumet les données du formulaire pour mettre à jour les informations de l'employé.
   * @input : aucun
   * @output : aucun
   */
  onSubmit(): void {
    const employeeData = {
      firstName: this.employeeForm.get('firstName')?.value,
      lastName: this.employeeForm.get('lastName')?.value,
      hireDate: this.employeeForm.get('hireDate')?.value,
      skills: JSON.stringify(this.selectedSkills)
    };

    this.employeeService.updateEmployee(this.employeeId, employeeData)
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          this.sweetMessageService.showToast('An error occurred while updating the employee.', 'error');
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.sweetMessageService.showToast('Employee updated successfully!', 'success');
          this.router.navigateByUrl('/employee-page');
        }
      });
  }
}
