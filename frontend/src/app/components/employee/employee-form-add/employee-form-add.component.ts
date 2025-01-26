import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';
import {ToastMessageService} from '../../../services/toast-message.service';

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

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private toastMessageService: ToastMessageService) {
    this.employeeForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      hireDate: '',
      profilePicture: null
    });
  }

  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills').subscribe((skills) => this.skills = skills);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.employeeForm.patchValue({ profilePicture: file });
      this.selectedFileName = file.name;
    }
  }

  toggleSkill(skillCode: string): void {
    if (this.selectedSkills.includes(skillCode)) {
      this.selectedSkills = this.selectedSkills.filter(code => code !== skillCode);
    } else {
      this.selectedSkills.push(skillCode);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('firstName', this.employeeForm.get('firstName')?.value);
    formData.append('lastName', this.employeeForm.get('lastName')?.value);
    formData.append('hireDate', this.employeeForm.get('hireDate')?.value);
    const profilePicture = this.employeeForm.get('profilePicture')?.value;
    if (profilePicture) {
      formData.append('profilePicture', profilePicture, profilePicture.name);
    }

    formData.append('skills', JSON.stringify(this.selectedSkills));

    this.http.post('http://localhost:3000/api/employees', formData).subscribe({
      next: (response) => {
        this.employeeForm.reset();
        this.selectedFileName = '';
        this.selectedSkills = [];
        this.employeeAdded.emit();
        this.toastMessageService.showToast('Employee added successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.toastMessageService.showToast('this.toastMessageService.showToast(\'Employee deleted successfully!\', \'success\');', 'error');
      }
    });
  }
}
