import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../../../models/employees.model';
import { Router } from '@angular/router';
import { SweetMessageService } from '../../../services/sweet-message.service';
import {NgClass, NgForOf} from '@angular/common';  // Importer le service

@Component({
  selector: 'app-skill-form-add',
  imports: [ReactiveFormsModule, NgForOf, NgClass],
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
  categories = ['A', 'B', 'C', 'D', 'E'];

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private router: Router, private sweetMessageService: SweetMessageService) {
    this.skillForm = this.formBuilder.group({
      category: ['', Validators.required],  // Catégorie obligatoire
      description: ['', Validators.required] // Description obligatoire
    });
  }

  selectCategory(category: string): void {
    this.skillForm.patchValue({ category });
  }

  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills').subscribe((skills) => this.skills = skills);
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.sweetMessageService.showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    this.isSubmitting = true;

    this.http.post('http://localhost:3000/api/skills', this.skillForm.value)
      .subscribe({
        next: () => {
          this.sweetMessageService.showToast('Skill ajouté avec succès !', 'success');
          this.router.navigateByUrl('/skill-page');        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du skill:', err);
          this.sweetMessageService.showToast('Erreur lors de l’ajout du skill.', 'error');
          this.isSubmitting = false;
        }
      });
  }
}
