import { Component } from '@angular/core';
import {SkillListComponent} from '../skill-list/skill-list.component';

@Component({
  selector: 'app-skill-page',
  imports: [
    SkillListComponent
  ],
  templateUrl: './skill-page.component.html',
  styleUrl: './skill-page.component.css'
})
export class SkillPageComponent {

}
