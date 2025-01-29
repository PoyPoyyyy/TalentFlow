import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.css'
})
export class SkillListComponent implements OnInit {
  searchQuery: string = '';
  skillsList: any[] = [];
  filteredSkills: any[] = [];
  filterType: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.http.get<any[]>('http://localhost:3000/api/skills')
      .subscribe((skills: any[]) => {
        this.skillsList = skills;
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
}
