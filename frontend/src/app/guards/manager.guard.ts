import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/login/authentification.service';

export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.currentUser && (authService.currentUser.type === 'employeeRh' || authService.currentUser.type === 'employeeRhResp')) {
    return true;
  } else {
    router.navigate(['/login-page']);
    return false;
  }
};
