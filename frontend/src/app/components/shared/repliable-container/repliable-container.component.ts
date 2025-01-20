import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-repliable-container',
  imports: [],
  templateUrl: './repliable-container.component.html',
  styleUrls: ['./repliable-container.component.css']
})
export class RepliableContainerComponent {
  @Input() title: string = 'Default Title';
  isOpen = false;

  toggleContent() {
    this.isOpen = !this.isOpen;
  }
}
