import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Skill } from '../../../models/employees.model';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SweetMessageService } from '../../../services/sweet-message.service';

@Component({
  selector: 'app-session-form-add',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './session-form-add.component.html',
  styleUrls: ['./session-form-add.component.css']
})
export class SessionFormAddComponent {
  employeeForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  isSubmitting = false;
  @Output() employeeAdded = new EventEmitter<unknown>();
  selectedFileName = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private sweetMessageService: SweetMessageService
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      hireDate: '',
      email: '',
      password: '',
      type: 'employeeRh',
      profilePicture: null
    });
  }
  /*
  * Méthode de cycle de vie Angular appelée lors de l'initialisation du composant.
  * Récupère la liste des compétences via une requête HTTP et l'affecte à la propriété 'skills'.
  * @input : Aucun
  * @output : Affecte le tableau 'skills' aux compétences récupérées.
  */
  ngOnInit(): void {
    this.http.get<Skill[]>('http://localhost:3000/api/skills')
      .subscribe((skills) => this.skills = skills);
  }
  /*
  * Méthode appelée lors de la sélection d'un fichier.
  * Met à jour le champ 'profilePicture' du formulaire et stocke le nom du fichier sélectionné.
  * @input : event - événement de sélection de fichier
  * @output : Aucun
  */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.employeeForm.patchValue({ profilePicture: file });
      this.selectedFileName = file.name;
    }
  }
  /*
  * Bascule l'état d'une compétence dans la liste des compétences sélectionnées.
  * Ajoute la compétence si elle n'est pas déjà présente, sinon la retire.
  * @input : skillCode - Code de la compétence à basculer
  * @output : Aucun
  */
  toggleSkill(skillCode: string): void {
    if (this.selectedSkills.includes(skillCode)) {
      this.selectedSkills = this.selectedSkills.filter(code => code !== skillCode);
    } else {
      this.selectedSkills.push(skillCode);
    }
  }
  /*
  * Méthode de soumission du formulaire.
  * Crée un objet FormData avec les valeurs du formulaire et les compétences sélectionnées,
  * puis appelle le service d'ajout d'employé.
  * Si l'ajout est réussi, le formulaire est réinitialisé et un événement 'employeeAdded' est émis.
  * @input : Aucun
  * @output : Émet un événement 'employeeAdded' en cas de succès
  */
  onSubmit(): void {
    const formData = new FormData();
    formData.append('firstName', this.employeeForm.get('firstName')?.value);
    formData.append('lastName', this.employeeForm.get('lastName')?.value);
    formData.append('hireDate', this.employeeForm.get('hireDate')?.value);
    formData.append('email', this.employeeForm.get('email')?.value);
    formData.append('password', this.employeeForm.get('password')?.value);
    formData.append('type', this.employeeForm.get('type')?.value);
    formData.append('skills', JSON.stringify(this.selectedSkills));

    this.employeeService.addEmployee(formData).subscribe({
      next: () => {
        this.employeeForm.reset();
        this.selectedFileName = '';
        this.selectedSkills = [];
        this.employeeAdded.emit();
        this.sweetMessageService.showToast('Employee added successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.sweetMessageService.showToast('An error occurred while adding the employee.', 'error');
      }
    });
  }
}
