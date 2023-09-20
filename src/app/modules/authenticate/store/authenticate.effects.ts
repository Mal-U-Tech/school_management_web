import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../services/user/user.service';
import {
  loginButtonClick,
  loginEffectFailed,
  loginEffectSuccessful,
  registerButtonClick,
  registerEffectFailed,
  registerEffectSuccessful,
} from './authenticate.actions';

@Injectable()
export class AuthenticateEffects {
  constructor(
    private readonly actions$: Actions,

    private readonly service: UserService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginButtonClick),
      exhaustMap(({ email, password }) =>
        this.service.login(email, password).pipe(
          map((user) => loginEffectSuccessful({ user })),
          catchError((error) => of(loginEffectFailed({ error })))
        )
      )
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerButtonClick),
      exhaustMap(({ user }) =>
        this.service.register(user).pipe(
          map((user) => registerEffectSuccessful({ user })),
          catchError((error) => of(registerEffectFailed({ error })))
        )
      )
    );
  });
}
