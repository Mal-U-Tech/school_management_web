import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'global-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass'],
})
export class LoaderComponent {
  @Input() messageLoader = '';
  @Input() showLoader = false;

  public showLoaderAnimation = {
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
    // display: 'none',
    opacity: 0,
  };

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = chng.currentValue;
      const prev = chng.previousValue;
      console.log(
        `${propName}: currentValue = ${cur}, previousValue = ${prev}`
      );

      if (propName == 'showLoader') {
        if (cur) {
          console.log('This is where we are');
          this.showLoaderAnimation = {
            animationName: 'fadeInLoader',
            animationDuration: '1s',
            animationFillMode: 'forwards',
            // display: 'flex',
            opacity: 1,
          };
        } else {
          console.log('It has to disappear');
          this.showLoaderAnimation = {
            animationName: 'fadeOutLoader',
            animationDuration: '1s',
            animationFillMode: 'forwards',
            // display: 'none',
            opacity: 0,
          };
        }
      }
    }
  }
}
