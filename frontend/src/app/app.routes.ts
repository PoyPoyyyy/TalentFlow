import { Routes } from '@angular/router';
import { EmployeePageComponent } from './components/employee/employee-page/employee-page.component';
import { MissionPageComponent } from './components/mission/mission-page/mission-page.component';
import { SkillPageComponent } from './components/skill/skill-page/skill-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EmployeeFormUpdateComponent } from './components/employee/employee-form-update/employee-form-update.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';
import { WelcomePageComponent } from './components/welcome/welcome-page/welcome-page.component';

export const routes: Routes = [
  { path: 'login-page', component: LoginPageComponent},
  { path: 'employee-page', component: EmployeePageComponent, canActivate: [AuthGuard]},
  { path: 'mission-page', component: MissionPageComponent, canActivate: [AuthGuard]},
  { path: 'skill-page', component: SkillPageComponent, canActivate: [AuthGuard]},
  {path: 'employee/edit/:id', component: EmployeeFormUpdateComponent, canActivate: [AuthGuard]},
  { path: 'welcome-page', component: WelcomePageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login-page', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
