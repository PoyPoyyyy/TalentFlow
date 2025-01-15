import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RepliableContainerComponent} from './components/shared/repliable-container/repliable-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RepliableContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
