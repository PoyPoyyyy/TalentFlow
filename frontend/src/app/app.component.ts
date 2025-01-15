import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {RepliableContainerComponent} from './components/shared/repliable-container/repliable-container.component';
import {MenuComponent} from './components/shared/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RepliableContainerComponent, RouterLink, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
