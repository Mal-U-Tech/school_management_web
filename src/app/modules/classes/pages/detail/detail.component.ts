import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentClass } from '../../store/classes.selectors';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  class$ = this.store.select(selectCurrentClass);

  constructor(
    private readonly store: Store,
  ) {}
}
