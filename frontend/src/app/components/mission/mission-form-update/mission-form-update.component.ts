import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../../models/employees.model';

@Component({
  selector: 'app-mission-form-update',
  imports: [],
  templateUrl: './mission-form-update.component.html',
  styleUrl: './mission-form-update.component.css'
})
export class MissionFormUpdateComponent implements OnInit {

  missionForm: FormGroup;
  skills: Skill[] = [];
  selectedSkills: string[] = [];
  missionId: number;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private http: HttpClient,
      private router: Router
    ) {
      this.missionForm = this.formBuilder.group({
        firstName: '',
        lastName: '',
        hireDate: ''
      });
      this.missionId = this.route.snapshot.params['id'];
    }

  ngOnInit(): void {
      this.http.get<Skill[]>('http://localhost:3000/api/skills').subscribe((skills) => this.skills = skills);
      this.loadMissionData();
  }

  loadMissionData() {
    this.http.get(`http://localhost:3000/api/employees/${this.missionId}`).subscribe((mission: any) => {
      //const hireDate = new Date(employee.hire_date).toISOString().split('T')[0];

      this.missionForm.patchValue({
        name: mission.name
      });
      this.selectedSkills = mission.skills.map((skill: any) => skill.code);
    });
  }

}
