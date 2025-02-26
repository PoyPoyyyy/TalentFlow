import { Routes } from '@angular/router';

import { EmployeePageComponent } from './components/employee/employee-page/employee-page.component';
import { MissionPageComponent } from './components/mission/mission-page/mission-page.component';
import { SkillPageComponent } from './components/skill/skill-page/skill-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EmployeeFormUpdateComponent } from './components/employee/employee-form-update/employee-form-update.component';
import { SkillFormUpdateComponent } from './components/skill/skill-form-update/skill-form-update.component';
import { MissionFormUpdateComponent } from './components/mission/mission-form-update/mission-form-update.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { WelcomePageComponent } from './components/welcome/welcome-page/welcome-page.component';

import { managerGuard } from './guards/manager.guard';
import { employeeGuard } from './guards/employee.guard';
import { authentificationGuard } from './guards/authentification.guard';

export const routes: Routes = [
  { path: 'employee-page', component: EmployeePageComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'mission-page', component: MissionPageComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'skill-page', component: SkillPageComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'employee/edit/:id', component: EmployeeFormUpdateComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'mission/edit/:id', component: MissionFormUpdateComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'skill/edit/:code', component: SkillFormUpdateComponent, canActivate: [managerGuard, authentificationGuard] },
  { path: 'welcome-page', component: WelcomePageComponent, canActivate: [managerGuard, authentificationGuard] },



  { path: 'login-page', component: LoginPageComponent },
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
