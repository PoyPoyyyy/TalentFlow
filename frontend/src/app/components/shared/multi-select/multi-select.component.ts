import { Component, EventEmitter, Output } from '@angular/core';
import { Skill } from '../../../models/employees.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-multi-select',
  imports: [FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css'
})
export class MultiSelectComponent {

  @Output() selectedSkillsChange = new EventEmitter<{skill: Skill, quantity: number}[]>();
  searchQuery: string = '';

  skillsList: Skill[] = [];

  filteredSkills: Skill[] = [];
  selectedSkills: {skill: Skill, quantity: number}[] = [];

  dropDownOpen: boolean = false;
  allSelected: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.loadSkills();
  }

  

  loadSkills() {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
            .subscribe((skills: Skill[]) => {
              this.skillsList = skills;
              this.filteredSkills = [...this.skillsList];
            });
  }

  getFilteredSkills() {
    const query = this.searchQuery.toLowerCase();
    this.filteredSkills = this.skillsList.filter(skill =>
      skill.code.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query)
    );
  }


  toggleDropDown() {
    this.dropDownOpen = !this.dropDownOpen;
  }

  isSkillSelected(skill: Skill): boolean {
    return this.selectedSkills.some(s => s.skill.code === skill.code);
  }

  
  toggleSkillSelection(skill: Skill, event: Event) {

    event.stopPropagation();
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedSkills.push({skill: skill, quantity: 1});
      
    } else {
      this.selectedSkills = this.selectedSkills.filter(s => s.skill.code !== skill.code);
    }

    this.selectedSkillsChange.emit(this.selectedSkills); 
    this.updateSelectAllCheckbox();
  }

  toggleAllSelection(event: Event) {
    
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allSelected = isChecked;

    if (isChecked) {
      this.selectedSkills.push(
        ...this.skillsList
          .filter(skill => !this.selectedSkills.some(s => s.skill.code === skill.code))
          .map(skill => ({ skill, quantity: 1 }))
      );
    } else {
      this.selectedSkills = [];
    }

  }

  updateSelectAllCheckbox() {
    this.allSelected = this.selectedSkills.length === this.skillsList.length;
  }


  getSkillQuantity(skill: Skill): number {
    return this.selectedSkills.find(s => s.skill.code === skill.code)?.quantity || 0;
  }

  toggleSkillSelectionQuantity(skill: Skill, event: Event) {

    const value = (event.target as HTMLInputElement).valueAsNumber;
  
    if (value >= 1) {
      if (!this.isSkillSelected(skill)) {
        this.selectedSkills.push({skill: skill, quantity:  1});
      } else {
        this.selectedSkills.find(s => s.skill.code === skill.code)!.quantity = value;
      }
    } else {
      this.selectedSkills = this.selectedSkills.filter(s => s.skill.code !== skill.code);
    }

    this.selectedSkillsChange.emit(this.selectedSkills);
    this.updateSelectAllCheckbox();

  }

  

}
