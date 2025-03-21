import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthentificationService } from '../../../services/login/authentification.service';
import { Router } from '@angular/router';
import { SweetMessageService } from '../../../services/sweet-message.service';
import {LogsService} from '../../../services/log/logs.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage: string = '';
  type: string = '';

  constructor(
      private authService: AuthentificationService,
      private router: Router,
      private sweetMessageService: SweetMessageService,
      private logsService: LogsService
  ) {
    if (this.authService.isAuthenticated()) {
      this.type = this.authService.currentUser.type;
      if (this.type === 'employee') {
        this.router.navigate(['/user-page']);
      } else if (this.type === 'employeeRh' || this.type === 'employeeRhResp') {
        this.router.navigate(['/welcome-page']);
      }
    }
  }
  /*
  * Soumet le formulaire et tente de se connecter avec les informations fournies.
  * @input : aucun
  * @output : aucun
  */
  onSubmit(): void {
    if (this.form.invalid) {
      this.sweetMessageService.showToast('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.type = this.authService.currentUser.type;
        if (this.type === 'employee') {
          this.router.navigate(['/user-page']);
        }
        if (this.type === 'employeeRh' || this.type === 'employeeRhResp') {
          this.router.navigate(['/welcome-page']);
        }
        this.sweetMessageService.showToast('Bienvenue ' + this.authService.currentUser.last_name + ' ' + this.authService.currentUser.first_name + ' connecté en tant que ' + this.type, 'success');
        const logMessage = `User ${this.authService.currentUser.id} logged in as ${this.type}`;

        this.logsService.createLog(
          this.authService.currentUser.id,
          'Login - ' + this.type,
          logMessage
        ).subscribe(() => {});
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la connexion';
        this.sweetMessageService.showToast(this.errorMessage, 'error');
      }
    });
  }
}
