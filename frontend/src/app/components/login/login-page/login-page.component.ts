import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthentificationService} from '../../../services/login/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  errorMessage: string = '';

  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.router.navigate(['/welcome-page']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la connexion';
      }
    });
  }
}
