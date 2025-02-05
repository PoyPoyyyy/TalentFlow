import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: 'RH' | 'Cadre' | null = null;

  login(username: string, password: string): boolean {
    if (username === 'a' && password === 'a') {
      this.isAuthenticated = true;
      this.userRole = 'RH';
      return true;
    } else if (username === 'b' && password === 'b') {
      this.isAuthenticated = true;
      this.userRole = 'Cadre';
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): 'RH' | 'Cadre' | null {
    return this.userRole;
  }
}
