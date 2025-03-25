import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() initializedSkills: {skill: Skill, quantity: number}[] = [];
  @Output() selectedSkillsChange = new EventEmitter<{skill: Skill, quantity: number}[]>();
  searchQuery: string = '';

  skillsList: Skill[] = [];

  filteredSkills: Skill[] = [];
  selectedSkills: {skill: Skill, quantity: number}[] = [];

  dropDownOpen: boolean = false;
  allSelected: boolean = false;

  constructor(private http: HttpClient) {}

  /*
  * Appelle le chargement des compétences et l'initialisation des compétences sélectionnées.
  * @input : Aucun.
  * @output : Aucun.
  */
  ngOnInit(): void {
      this.loadSkills();
      this.initializeSelectedSkills();
  }

  /*
  * Charge toutes les compétences.
  * @input : Aucun.
  * @output : Aucun.
  */
  loadSkills() {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
            .subscribe((skills: Skill[]) => {
              this.skillsList = skills;
              this.filteredSkills = [...this.skillsList];
            });
  }

  /*
  * Affiche les compétences en fonction de la requête de recherche saisie.
  * @input : Aucun.
  * @output : Aucun.
  */
  getFilteredSkills(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSkills = this.skillsList.filter(skill =>
      skill.code.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query)
    );
  }

  /*
  * Alterne entre true et false en fonction de l'état de l'input (ouvert ou fermé).
  * @input : Aucun.
  * @output : Aucun.
  */
  toggleDropDown(): void {
    this.dropDownOpen = !this.dropDownOpen;
  }

  /*
  * Détermine si une compétence est sélectionnée.
  * @input : skill (Skill) - compétence à tester.
  * @output : boolean.
  */
  isSkillSelected(skill: Skill): boolean {
    return this.selectedSkills.some(s => s.skill.code === skill.code);
  }

  /*
  * Ajoute ou retire une compétence à la sélection,
  * puis émet l'événement vers le parent avec la sélection mise à jour.
  * @input : skill (Skill), event (Event) - compétence cible et évènement (checkbox sélectionnée ou non).
  * @output : Aucun.
  */
  toggleSkillSelection(skill: Skill, event: Event): void {

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

  /*
  * Ajoute ou retire toutes les compétences à la sélection.
  * @input : event (Event) - évènement (checkbox sélectionnée ou non).
  * @output : Aucun.
  */
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

  /*
  * Met à jour l'état de la case 'tout sélectionner'.
  * @input : Aucun.
  * @output : Aucun.
  */
  updateSelectAllCheckbox(): void {
    this.allSelected = this.selectedSkills.length === this.skillsList.length;
  }

  /*
  * Récupère la quantité sélectionnée pour une compétence donnée (ou 0 par défaut).
  * @input : skill (Skill) - compétence donnée.
  * @output : number - quantité demandée pour cette compétence.
  */
  getSkillQuantity(skill: Skill): number {
    return this.selectedSkills.find(s => s.skill.code === skill.code)?.quantity || 0;
  }

  /*
  * Met à jour la quantité associée à une compétence sélectionnée.
  * Si la valeur est < 1, on retire la compétence de la sélection.
  * @input : skill (Skill), event (Event) - compétence donnée et valeur de l'input.
  * @output : Aucun.
  */
  toggleSkillSelectionQuantity(skill: Skill, event: Event): void {

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

  /*
  * Initialise la sélection avec les compétences passées en Input pour préremplir le formulaire.
  * @input : Aucun.
  * @output : Aucun.
  */
  initializeSelectedSkills():void {
    if (this.initializedSkills && this.initializedSkills.length > 0) {
      this.selectedSkills = [...this.initializedSkills];
    }
  }

}
