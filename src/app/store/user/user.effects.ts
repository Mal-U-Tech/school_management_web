import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { UserApiService } from 'src/app/shared/user/user-api.service';
import { IUser } from 'src/app/shared/user/user.interface';
import {
  checkModulesRequest,
  isSchoolInfoLoading,
} from '../school-info/school-info.actions';
import {
  isLoading,
  login,
  loginError,
  loginSuccessful,
  setToken,
  setUser,
} from './user.actions';

@Injectable()
export class AuthEffects {
  // on login, send auth data to backend,
  // get the user and add to store
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        from(this.authService.authLogin(email, password)).pipe(
          tap(({ token }) => {
            this.authService.successToast('Login successful.');
            return of(setToken({ token }));
          }),
          // map(({ user }) => setUser({user: user as IUser})),
          catchError((error) => {
            this.authService.errorToast(error);
            return of(loginError({ message: error.toString() }));
          })
        )
      ),
      switchMap((user) => {
        console.log(user);
        const currUser = user as any;
        // console.log(currUser['message']);
        if (currUser['token'] != null || currUser['token'] != undefined) {
          return of(
            isLoading({ isLoading: false }),
            setUser({ user: user as IUser }),
            setToken({ token: (user as IUser).token }),
            isSchoolInfoLoading({ isSchoolInfoLoading: true }),
            checkModulesRequest({
              _id: (user as IUser)._id || '',
              user: user as IUser,
            })
          );
        } else {
          return of(isLoading({ isLoading: false }));
        }
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: UserApiService,
    private readonly router: Router
  ) {}
}
