import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { SweetMessageService} from '../sweet-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private authenticated = false;
  private loginUrl = 'http://localhost:3000/api/login';
  public currentUser: any = null;

  constructor(
      private http: HttpClient,
      private router: Router,
      private sweetMessageService: SweetMessageService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.authenticated = true;
    }
  }
  /*
  * Effectue une requête de connexion avec l'email et le mot de passe fournis.
  * @input email L'email de l'utilisateur.
  * @input password Le mot de passe de l'utilisateur.
  * @output Un Observable contenant la réponse de la requête de connexion.
  */
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, {email, password}).pipe(
        tap((response: any) => {
          if (response && response.message === 'Login successful') {
            this.authenticated = true;
            this.currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
        }),
        catchError((error) => {
          this.sweetMessageService.showToast('Erreur de connexion : ' + error.error.message, 'error');
          return throwError(error);
        })
    );
  }
  /*
  * Déconnecte l'utilisateur en cours en réinitialisant l'état d'authentification et en supprimant les informations de l'utilisateur du stockage local.
  * @input : aucun
  * @output : aucun
  */
  logout(): void {
    this.authenticated = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login-page']);
  }

  /*
  * Vérifie si l'utilisateur est actuellement authentifié.
  * @input : aucun
  * @output : boolean - true si l'utilisateur est authentifié, false sinon.
   */
  isAuthenticated(): boolean {
    return this.authenticated;
  }
}


