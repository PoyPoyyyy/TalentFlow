import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthentificationService} from '../services/login/authentification.service';

export const employeeRhRespGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);
  if (authService.currentUser && authService.currentUser.type === 'employeeRhResp') {
    return true;
  } else {
    authService.logout();
    router.navigate(['/login-page']);
    return false;
  }
  return true;
};
