import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    appInitializedEffect,
  loadPermissionEffectFailed,
  loadPermissionEffectSuccess,
  loadSchoolsEffectFailed,
  loadSchoolsEffectSuccessful,
  tokenExpiredLogoutEffect,
  tokenExpiredLogoutEffectComplete,
  userAppLanding,
  userLandingEffectSuccessful,
} from './app.actions';
import { AppService } from '../services/app.service';
import { bufferCount, catchError, exhaustMap, filter, map } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import {
  loginEffectSuccessful,
  registerEffectSuccessful,
} from '../modules/authenticate/store/authenticate.actions';
import { toolbarLogoutClick } from '../modules/dashboard/store/dashboard.actions';
import { PermissionService } from '../services/permission.service';
import { forkJoin, of } from 'rxjs';
import { SchoolService } from '../services/school.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,

    private router: Router,

    private app: AppService,
    private permission: PermissionService,
    private school: SchoolService
  ) {}

  landing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userAppLanding),
      map(() => this.app.loaduser()),
      filter((u) => !!u),
      map((user) => userLandingEffectSuccessful({ user: user as IUser }))
    );
  });

  landed$ = createEffect(() => {
    const actions = [
      userLandingEffectSuccessful,
      loadSchoolsEffectSuccessful,
      loadPermissionEffectSuccess,
    ];
    return this.actions$.pipe(
      ofType(...actions),
      bufferCount(actions.length),
      map(() => appInitializedEffect()),
    );
  })

  schools$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userLandingEffectSuccessful,
        loginEffectSuccessful,
        registerEffectSuccessful
      ),
      exhaustMap(() => {
        return this.school.schools().pipe(
          exhaustMap((schools) =>
            forkJoin(
              schools.map((school) => this.school.profile(school.id))
            ).pipe(
              map((school_profiles) =>
                loadSchoolsEffectSuccessful({ schools: school_profiles })
              )
            )
          ),
          catchError((error) => of(loadSchoolsEffectFailed({ error })))
        );
      })
    );
  });

  permissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userLandingEffectSuccessful,
        loginEffectSuccessful,
        registerEffectSuccessful
      ),
      exhaustMap(() => {
        return this.permission.list().pipe(
          map((permissions) => loadPermissionEffectSuccess({ permissions })),
          catchError((error) => of(loadPermissionEffectFailed({ error })))
        );
      })
    );
  });

  verify$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLandingEffectSuccessful),
      map(() => {
        if (this.app.verify()) {
          return tokenExpiredLogoutEffectComplete();
        }
        return tokenExpiredLogoutEffect()
      })
    );
  });

  dashboard$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          userLandingEffectSuccessful,
          loginEffectSuccessful,
          registerEffectSuccessful
        ),
        map(() => this.router.navigate(['dashboard']))
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(toolbarLogoutClick, tokenExpiredLogoutEffect),
        map(() => {
          this.app.logout();
          this.router.navigate(['login']);
        })
      );
    },
    { dispatch: false }
  );
}
