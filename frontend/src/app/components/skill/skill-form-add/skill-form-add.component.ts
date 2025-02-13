import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';
import { SweetMessageService } from '../../../services/sweet-message.service';  // Importer le service

@Component({
  selector: 'app-skill-form-add',
  imports: [ReactiveFormsModule],
  templateUrl: './skill-form-add.component.html',
  styleUrls: ['./skill-form-add.component.css']
})
export class SkillFormAddComponent implements OnInit {
  skillForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  isSubmitting = false;
  @Output() skillAdded = new EventEmitter<unknown>();
  selectedFileName = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private sweetMessageService: SweetMessageService) {
    this.skillForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills').subscribe((skills) => this.skills = skills);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('firstName', this.skillForm.get('description')?.value);

    this.http.post('http://localhost:3000/api/skills', formData).subscribe({
      next: (response) => {
        this.skillForm.reset();
        this.selectedFileName = '';
        this.selectedSkills = [];
        this.skillAdded.emit();
        this.sweetMessageService.showToast('Employee added successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.sweetMessageService.showToast('An error occurred while adding the employee.', 'error');
      }
    });
  }
}
