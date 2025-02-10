import { Routes } from '@angular/router';
import {EmployeePageComponent} from './components/employee/employee-page/employee-page.component';
import {MissionPageComponent} from './components/mission/mission-page/mission-page.component';
import {SkillPageComponent} from './components/skill/skill-page/skill-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { MissionFormUpdateComponent } from './components/mission/mission-form-update/mission-form-update.component';

export const routes: Routes = [
  
  {path: 'employee-page', component: EmployeePageComponent},
  {path: 'mission-page', component: MissionPageComponent},
  {path: 'skill-page', component: SkillPageComponent},

  {path: 'mission/edit/:id', component: MissionFormUpdateComponent},
  {path: 'index', redirectTo: '/', pathMatch: 'full'},

  {path: '', redirectTo: 'employee-page', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
