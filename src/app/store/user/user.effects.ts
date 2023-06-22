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
            return setToken({ token });
          }),
          // map(({ user }) => setUser({user: user as IUser})),
          catchError((error) => {
            this.authService.errorToast(error);
            return of(loginError({ message: error.toString() }));
          })
        )
      ),
      // switchMap((user) => {
      //   // console.log(user as IUser);
      //   // assign values to new user
      //   const currUser = user as IUser;
      //   of(setUser({ user: currUser }));
      //   of(setToken({ token: currUser.token }));
      //   isLoading({ isLoading: false });
      //
      //   // dispatch action to load school info from the server
      //   return of(
      //     checkModulesRequest({ _id: currUser._id || '', user: currUser })
      //   );
      // })
      switchMap(
        (user) =>
          of(
            isLoading({ isLoading: false }),
            setUser({ user: user as IUser }),
            setToken({ token: (user as IUser).token }),
            isSchoolInfoLoading({ isSchoolInfoLoading: true }),
            checkModulesRequest({
              _id: (user as IUser)._id || '',
              user: user as IUser,
            })
          )

        //   from(user).pipe(
        //     tap(({ user }) => setUser({ user: user as IUser })),
        //     tap(({ user }) => setToken({ token: (user as IUser).token })),
        //     tap(({ user }) => {
        //       const currUser = user as IUser;
        //       if (currUser.token != null || currUser.token != '') {
        //         return of(isLoading({ isLoading: false }));
        //       }
        //
        //       return of(
        //         loginSuccessful({
        //           user: currUser,
        //           isLoading: false,
        //         })
        //       );
        //     })
        //   )
        // )
        // switchMap(() => checkModulesRequest({ _id: (user as IUser)._id || '', user: user as IUser }),
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: UserApiService,
    private readonly router: Router
  ) {}
}
