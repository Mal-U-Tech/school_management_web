import { Component, ElementRef, Input, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  _observed = new Subject();
  _observer = new window.IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      this._observed.next(true);
    }
    this._observed.next(false);
  }, { root: null, threshold: 0.9 });

  @Input() type: 'info' | 'warning' | 'error' = 'info';
  @Input() dismissable = false;

  @Output() dismissed = new Subject();
  @Output() observed = this._observed.pipe(
    debounceTime(4000)
  );

  constructor(
    private readonly ref: ElementRef
  ) {
    this._observer.observe(this.ref.nativeElement);
  }
}
