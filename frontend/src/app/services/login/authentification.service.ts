import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private authenticated = false;
  private loginUrl = 'http://localhost:3000/api/login';
  public currentUser: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.message === 'Login successful') {
          this.authenticated = true;
          this.currentUser = response.user;
        }
      })
    );
  }

  logout(): void {
    this.authenticated = false;
    this.currentUser = null;
    this.router.navigate(['/login-page']);
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
