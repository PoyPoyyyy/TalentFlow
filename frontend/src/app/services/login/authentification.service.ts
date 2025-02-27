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

  logout(): void {
    this.authenticated = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login-page']);
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}


