import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';
import { SweetMessageService } from '../../../services/sweet-message.service';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-employee-form-add',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form-add.component.html',
  styleUrls: ['./employee-form-add.component.css']
})
export class EmployeeFormAddComponent implements OnInit {
  employeeForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  isSubmitting = false;
  @Output() employeeAdded = new EventEmitter<unknown>();
  selectedFileName = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private sweetMessageService: SweetMessageService
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      hireDate: '',
      email: '',
      password: '',
      profilePicture: null
    });
  }

  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
      .subscribe((skills) => this.skills = skills);
  }

  /*
   * Gère la sélection d'un fichier (photo de profil) dans le formulaire.
   * @input : event (any) - L'événement de sélection de fichier.
   * @output : aucun
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.employeeForm.patchValue({profilePicture: file});
      this.selectedFileName = file.name;
    }
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
   * Soumet le formulaire pour ajouter un nouvel employé à l'API.
   * @input : aucun
   * @output : aucun
   */
  onSubmit(): void {
    const formData = new FormData();
    formData.append('firstName', this.employeeForm.get('firstName')?.value);
    formData.append('lastName', this.employeeForm.get('lastName')?.value);
    formData.append('hireDate', this.employeeForm.get('hireDate')?.value);
    formData.append('email', this.employeeForm.get('email')?.value);
    formData.append('password', this.employeeForm.get('password')?.value);
    formData.append('type', 'employee');
    const profilePicture = this.employeeForm.get('profilePicture')?.value;
    if (profilePicture) {
      formData.append('profilePicture', profilePicture, profilePicture.name);
    }
    formData.append('skills', JSON.stringify(this.selectedSkills));

    this.employeeService.addEmployee(formData).subscribe({
      next: () => {
        this.employeeForm.reset();
        this.selectedFileName = '';
        this.selectedSkills = [];
        this.employeeAdded.emit();
        this.sweetMessageService.showToast('Employee added successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.sweetMessageService.showToast('An error occurred while adding the employee.', 'error');
      }
    });
  }
}
