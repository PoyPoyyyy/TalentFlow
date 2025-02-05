import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from './components/shared/menu/menu.component';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TalentFlow';
  constructor(public authService: AuthService) {}
}
