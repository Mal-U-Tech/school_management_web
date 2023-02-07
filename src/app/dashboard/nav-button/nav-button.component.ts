import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.sass'],
})
export class NavButtonComponent {
  @Input() buttonTitle = '';
}
