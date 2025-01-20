import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';

@Component({
  selector: 'app-employee-form-add',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form-add.component.html',
  styleUrl: './employee-form-add.component.css'
})

export class EmployeeFormAddComponent implements OnInit {
  employeeForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  @Output() employeeAdded = new EventEmitter<unknown>();

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.employeeForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      hireDate: '',
    });
  }
  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
      .subscribe((skills) => this.skills = skills);
  }
  onSkillChange(skillCode: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSkills.push(skillCode);
    } else {
      this.selectedSkills = this.selectedSkills.filter(code => code !== skillCode);
    }
  }
  onSubmit(): void {
    const employeeData = {
      ...this.employeeForm.value,
      skills: this.selectedSkills
    };
    this.http.post('http://localhost:3000/api/employees', employeeData, { responseType: 'text' })
      .subscribe(() => {
        this.employeeForm.reset();
        this.selectedSkills = [];
        this.employeeAdded.emit();
      });
  }

  toggleSkill(skillCode: string): void {
    if (this.selectedSkills.includes(skillCode)) {
      this.selectedSkills = this.selectedSkills.filter((code) => code !== skillCode);
    } else {
      this.selectedSkills.push(skillCode);
    }
  }
}
