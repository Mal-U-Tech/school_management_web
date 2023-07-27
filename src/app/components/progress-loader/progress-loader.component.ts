import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-loader',
  templateUrl: './progress-loader.component.html',
  styleUrls: ['./progress-loader.component.scss'],
})
export class ProgressLoaderComponent {
  @Input() isLoading?: any;
}
