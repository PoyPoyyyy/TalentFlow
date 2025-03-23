import { Routes } from '@angular/router';

// Importation des components
import { EmployeePageComponent } from './components/employee/employee-page/employee-page.component';
import { EmployeeFormUpdateComponent } from './components/employee/employee-form-update/employee-form-update.component';
import { MissionPageComponent } from './components/mission/mission-page/mission-page.component';
import { MissionFormUpdateComponent } from './components/mission/mission-form-update/mission-form-update.component';
import { WelcomePageComponent } from './components/welcome/welcome-page/welcome-page.component';
import { SkillPageComponent } from './components/skill/skill-page/skill-page.component';
import { SkillFormUpdateComponent } from './components/skill/skill-form-update/skill-form-update.component';
import { SessionPageComponent} from './components/session/session-page/session-page.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserPageComponent } from './components/user/user-page/user-page.component';
import { LogPageComponent } from './components/log/log-page/log-page.component';

// Importations des guards
import { authentificationGuard } from './guards/authentification.guard';
import { employeeGuard } from './guards/employee.guard';
import { employeeRhGuard } from './guards/employee-rh.guard';
import { employeeRhRespGuard } from './guards/employee-rh-resp.guard';


export const routes: Routes = [
  // Employee
  { path: 'user-page', component: UserPageComponent, canActivate: [authentificationGuard, employeeGuard] },
  // EmployeeRh and EmployeeRhResp
  { path: 'welcome-page', component: WelcomePageComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'employee-page', component: EmployeePageComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'employee/edit/:id', component: EmployeeFormUpdateComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'mission-page', component: MissionPageComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'mission/edit/:id', component: MissionFormUpdateComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'skill-page', component: SkillPageComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  { path: 'skill/edit/:code', component: SkillFormUpdateComponent, canActivate: [authentificationGuard, employeeRhGuard] },
  // EmployeeRhResp
  { path : 'session-page', component: SessionPageComponent, canActivate: [authentificationGuard, employeeRhRespGuard] },
  { path : 'log-page', component: LogPageComponent, canActivate: [authentificationGuard, employeeRhRespGuard] },

  { path: 'login-page', component: LoginPageComponent },
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];