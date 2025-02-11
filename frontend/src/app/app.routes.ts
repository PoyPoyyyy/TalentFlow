import { Routes } from '@angular/router';
import {EmployeePageComponent} from './components/employee/employee-page/employee-page.component';
import {MissionPageComponent} from './components/mission/mission-page/mission-page.component';
import {SkillPageComponent} from './components/skill/skill-page/skill-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {EmployeeFormUpdateComponent} from './components/employee/employee-form-update/employee-form-update.component';
import {SkillFormUpdateComponent} from './components/skill/skill-form-update/skill-form-update.component';


export const routes: Routes = [
  {path: 'employee-page', component: EmployeePageComponent},
  {path: 'mission-page', component: MissionPageComponent},
  {path: 'skill-page', component: SkillPageComponent},
  {path: 'employee/edit/:id', component: EmployeeFormUpdateComponent},
  {path: 'index', redirectTo: '/', pathMatch: 'full'},
  {path: 'skill/edit/:code', component: SkillFormUpdateComponent},
  {path: '', redirectTo: 'employee-page', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
