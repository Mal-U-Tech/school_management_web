import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { userAppLanding } from './app.actions';

Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  landing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userAppLanding),
    )
  }, { dispatch: false });
}
