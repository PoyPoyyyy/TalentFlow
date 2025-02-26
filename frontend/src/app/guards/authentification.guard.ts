import { CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/login/authentification.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authentificationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(['/login-page']);
    return false;
  }
  return true;
};
