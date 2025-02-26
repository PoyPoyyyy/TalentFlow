import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthentificationService} from '../../../services/login/authentification.service';
import { Router } from '@angular/router';
import { SweetMessageService } from '../../../services/sweet-message.service';
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
    private router: Router,
    private sweetMessageService: SweetMessageService
  ) {}
  /*
   * Soumet le formulaire et tente de se connecter avec les informations fournies.
   * @input : aucun
   * @output : aucun
   */
  onSubmit(): void {
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.router.navigate(['/welcome-page']);
        this.sweetMessageService.showToast('Connected as '+this.authService.currentUser.type, 'success');

      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la connexion';
      }
    });
  }
}
