import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap, tap } from 'rxjs';
import {
  isLoading,
  login,
  loginError,
  setToken,
  setUser,
} from './authenticate.actions';
import { checkModulesRequest, isSchoolInfoLoading } from 'src/app/store/school-info/school-info.actions';
import { UserService } from '../services/user/user.service';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class AuthenticateEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: UserService,
  ) {}
  // on login, send auth data to backend,
  // get the user and add to store
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        from(this.service.authLogin(email, password)).pipe(
          tap(({ token }) => {
            this.service.successToast('Login successful.');
            return of(setToken({ token }));
          }),
          // map(({ user }) => setUser({user: user as IUser})),
          catchError((error) => {
            this.service.errorToast(error);
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
}
