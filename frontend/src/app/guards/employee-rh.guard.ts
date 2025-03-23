import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthentificationService} from '../services/login/authentification.service';

export const employeeRhGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);
  if (authService.currentUser && (authService.currentUser.type === 'employeeRh' || authService.currentUser.type === 'employeeRhResp')) {
    return true;
  } else {
    authService.logout();
    router.navigate(['/login-page']);
    return false;
  }
  return true;
};
