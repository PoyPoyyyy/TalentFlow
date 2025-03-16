import { Routes } from '@angular/router';
import {EmployeePageComponent} from './components/employee/employee-page/employee-page.component';
import {MissionPageComponent} from './components/mission/mission-page/mission-page.component';
import {SkillPageComponent} from './components/skill/skill-page/skill-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {EmployeeFormUpdateComponent} from './components/employee/employee-form-update/employee-form-update.component';
import {SkillFormUpdateComponent} from './components/skill/skill-form-update/skill-form-update.component';
import { MissionFormAddComponent } from './components/mission/mission-form-add/mission-form-add.component';
import { MissionFormUpdateComponent } from './components/mission/mission-form-update/mission-form-update.component';
import { WelcomePageComponent } from './components/welcome/welcome-page/welcome-page.component';

export const routes: Routes = [
  {path: 'employee-page', component: EmployeePageComponent},
  {path: 'mission-page', component: MissionPageComponent},
  {path: 'skill-page', component: SkillPageComponent},
  {path: 'welcome-page', component: WelcomePageComponent},
  {path: 'employee/edit/:id', component: EmployeeFormUpdateComponent},
  {path: 'mission/edit/:id', component: MissionFormUpdateComponent},
  {path: 'index', redirectTo: '/welcome-page', pathMatch: 'full'},
  {path: 'skill/edit/:code', component: SkillFormUpdateComponent},
  {path: '', redirectTo: 'employee-page', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
