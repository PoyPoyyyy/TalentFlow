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
  sortColumn: string = 'last_name';
  sortDirection: number = 1;

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

  sortSkills(column: string, toggle: boolean = true): void {
    if (!Object.keys(this.skill[0] ?? {}).includes(column)) return;
    const key = column as keyof Skill;

    if (toggle) {
      this.sortDirection = this.sortColumn === key ? -this.sortDirection : 1;
    }
    this.sortColumn = key;

    this.filteredSkills.sort((a, b) => {
      let valueA = a[key] as string | number;
      let valueB = b[key] as string | number;

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return -1 * this.sortDirection;
      if (valueA > valueB) return 1 * this.sortDirection;
      return 0;
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
          this.loadSkills();
        },
        error: (error) => {
          console.error('Error deleting skill:', error);
          this.sweetMessageService.showToast('An error occurred while deleting the skill.', 'error');
        },
      });
  }
}
