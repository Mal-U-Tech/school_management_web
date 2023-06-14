import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs';
import { UserApiService } from 'src/app/shared/user/user-api.service';

@Injectable()
export class AuthEffects {
  // on login, send auth data to backend,
  // get the user and add to store
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) => {
        return this.authService.userLogin(email, password);
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: UserApiService,
    private readonly router: Router
  ) {}
}
