import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SweetMessageService } from '../../../services/sweet-message.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-skill-form-update',
  templateUrl: './skill-form-update.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./skill-form-update.component.css']
})
export class SkillFormUpdateComponent implements OnInit {
  skillForm: FormGroup;
  skillCode: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sweetMessageService: SweetMessageService,
    private router: Router
  ) {
    this.skillForm = this.formBuilder.group({
      code: '',
      description: '',
      /*
      code: [{ value: '', disabled: false }, Validators.required], // Désactivé pour empêcher la modification
      description: ['', Validators.required]*/
    });
    this.skillCode = this.route.snapshot.params['code'];
  }

  ngOnInit(): void {
    this.loadSkillData();
  }

  loadSkillData(): void {
    this.http.get(`http://localhost:3000/api/skills/${this.skillCode}`).subscribe((skill: any) => {
      this.skillForm.patchValue({
        code: skill.code,
        description: skill.description
      });
    });
  }

  onSubmit(): void {
    const skillData = {
      code: this.skillCode,
      description: this.skillForm.get('description')?.value
    };

    this.http.put(`http://localhost:3000/api/skills/${this.skillCode}`, skillData)
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          this.sweetMessageService.showToast('An error occurred while updating the skill.', 'error');
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.sweetMessageService.showToast('Skill updated successfully!', 'success');
            this.router.navigateByUrl('/skill-page'); // Redirection après mise à jour
        }
      });
  }
}
