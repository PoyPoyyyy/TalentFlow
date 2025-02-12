import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Employee} from '../../../models/employees.model';
import {Skill} from '../../../models/skills.model';
import {SweetMessageService} from '../../../services/sweet-message.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.css'
})
export class SkillListComponent implements OnInit {
  skill: Skill[] = [];
  saveQuery: string = '';
  searchQuery: string = '';
  skillsList: any[] = [];
  filteredSkills: any[] = [];
  filterType: string = 'all';

  constructor(
    private http: HttpClient,
    private sweetMessageService: SweetMessageService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.http.get<any[]>('http://localhost:3000/api/skills')
      .subscribe((skill: any[]) => {
        this.skill = skill;
        this.skillsList = skill;
        this.filteredSkills = [...this.skillsList];
      });
  }

  filterSkills(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSkills = this.skillsList.filter(skill => {
      if (this.filterType === 'code') {
        return skill.code.toLowerCase().includes(query);
      } else if (this.filterType === 'description') {
        return skill.description.toLowerCase().includes(query);
      } else {
        return skill.code.toLowerCase().includes(query) || skill.description.toLowerCase().includes(query);
      }
    });
  }

  onDelete(skill: Skill): void {
    this.sweetMessageService
      .showAlert(
        'Confirm Deletion',
        `Are you sure you want to delete ${skill.code} ${skill.description}?`,
        'warning',
        true,
        'Delete',
        'Cancel'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.confirmDelete(skill.code);
        }
      });
  }

  private confirmDelete(skillCode: string): void {
    this.saveQuery = this.searchQuery;
    this.http
      .delete(`http://localhost:3000/api/skills/${skillCode}`, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.sweetMessageService.showToast('Skill deleted successfully.', 'success');
          this.loadSkills();
          this.searchQuery = this.saveQuery;
          this.filterSkills();
        },
        error: (error) => {
          console.error('Error deleting skill:', error);
          this.sweetMessageService.showToast('An error occurred while deleting the skill.', 'error');
        },
      });
  }
}
