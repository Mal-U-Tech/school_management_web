import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { userAppLanding } from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store) {
    this.store.dispatch(userAppLanding());
  }
}
