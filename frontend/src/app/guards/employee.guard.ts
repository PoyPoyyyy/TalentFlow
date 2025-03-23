import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/login/authentification.service';

export const employeeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.currentUser && authService.currentUser.type === 'employee') {
    return true;
  } else {
    router.navigate(['/login-page']);
    return false;
  }
};
