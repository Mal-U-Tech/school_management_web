import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() diameter: number = 0;
  @Input() color?: 'primary' | 'accent' | 'warn';
}
