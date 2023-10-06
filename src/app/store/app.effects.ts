import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  appInitializedEffect,
  loadNotificationsEffectFailed,
  loadNotificationsEffectSuccessful,
  loadPermissionEffectFailed,
  loadPermissionEffectSuccess,
  loadSchoolsEffectFailed,
  loadSchoolsEffectSuccessful,
  tokenExpiredLogoutEffect,
  tokenExpiredLogoutEffectComplete,
  updateAppSchoolEffect,
  userAppLanding,
  userLandingEffectSuccessful,
} from './app.actions';
import { AppService } from '../services/app.service';
import {
  bufferCount,
  catchError,
  exhaustMap,
  filter,
  map,
} from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import {
  Router,
} from '@angular/router';
import {
  loginEffectSuccessful,
  registerEffectSuccessful,
} from '../modules/authenticate/store/authenticate.actions';
import { toolbarLogoutClick } from '../modules/dashboard/store/dashboard.actions';
import { PermissionService } from '../services/permission.service';
import { forkJoin, of } from 'rxjs';
import { SchoolService } from '../services/school.service';
import { NotificationsService } from '../services/notifications.service';
import { updateClassEffectSuccessful } from '../modules/classes/store/classes.actions';
import { selectCurrentSchool } from '../modules/schools/store/schools.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,

    private store: Store,
    private router: Router,

    private app: AppService,
    private permission: PermissionService,
    private school: SchoolService,
    private notification: NotificationsService,
  ) {}

  landing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenExpiredLogoutEffectComplete),
      map(() => this.app.loaduser()),
      filter((u) => !!u),
      map((user) => {
        return userLandingEffectSuccessful({ user: user as IUser });
      })
    );
  });

  landed$ = createEffect(() => {
    const actions = [
      loadSchoolsEffectSuccessful,
      loadPermissionEffectSuccess,
    ];
    return this.actions$.pipe(
      ofType(...actions),
      bufferCount(actions.length),
      map(() => appInitializedEffect())
    );
  });

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
                loadSchoolsEffectSuccessful({
                  schools: school_profiles,
                })
              )
            )
          ),
          catchError((error) => of(loadSchoolsEffectFailed({ error })))
        );
      })
    );
  });

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        updateClassEffectSuccessful,
      ),
      concatLatestFrom(() => this.store.select(selectCurrentSchool)),
      exhaustMap(([, school]) => {
        return this.school.profile(school?.id as string).pipe(
          map((school) => updateAppSchoolEffect({ school }))
        )
      })
    )
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

  notifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userLandingEffectSuccessful,
        loginEffectSuccessful,
        registerEffectSuccessful
      ),
      exhaustMap(() => {
        return this.notification.load().pipe(
          map(response => {
            const notifications = response.data;
            return loadNotificationsEffectSuccessful({ notifications });
          }),
          catchError(error => of(loadNotificationsEffectFailed({ error })))
        )
      })
    );
  });

  verify$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userAppLanding),
      map(() => {
        if (this.app.verify()) {
          return tokenExpiredLogoutEffectComplete();
        }
        return tokenExpiredLogoutEffect();
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
