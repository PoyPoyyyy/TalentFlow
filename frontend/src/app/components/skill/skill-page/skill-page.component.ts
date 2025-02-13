import {Component, ViewChild} from '@angular/core';
import {SkillListComponent} from '../skill-list/skill-list.component';
import {RepliableContainerComponent} from '../../shared/repliable-container/repliable-container.component';
import {SkillFormAddComponent} from '../skill-form-add/skill-form-add.component';

@Component({
  selector: 'app-skill-page',
  imports: [SkillListComponent, SkillFormAddComponent, RepliableContainerComponent],
  templateUrl: './skill-page.component.html',
  styleUrl: './skill-page.component.css'
})
export class SkillPageComponent {
  @ViewChild(SkillListComponent) skillList!: SkillListComponent;
  onSkillAdded(): void {
    this.skillList.loadSkills();
  }
}
