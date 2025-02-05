import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {
  userRole: 'RH' | 'Cadre' | null = null;

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole();
  }
}
