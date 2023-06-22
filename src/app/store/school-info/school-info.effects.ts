import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, tap } from 'rxjs';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { UserApiService } from 'src/app/shared/user/user-api.service';
import { IUser } from 'src/app/shared/user/user.interface';
import { setUser } from '../user/user.actions';
import {
  addSchoolInfo,
  checkModulesError,
  checkModulesRequest,
  isSchoolInfoLoading,
} from './school-info.actions';

@Injectable()
export class SchoolInfoEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly schoolInfoService: UserApiService,
    private readonly router: Router
  ) {}
  // get the school info data
  getSchoolInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(checkModulesRequest),
      mergeMap(({ _id, user }) =>
        from(this.schoolInfoService.checkModules(_id)).pipe(
          tap(({ success, missing, data }) => {
            console.log('I am inside school info request effect');
            console.log(data);
            // return addSchoolInfo({school_info: {} as ISchoolInfo});
            console.log(data);
            of(isSchoolInfoLoading({ isSchoolInfoLoading: false }));
            const info = data as any;
            if (missing.length) {
              if (missing[0].name === 'school-info') {
                of(setUser({ user: user as IUser }));
                this.navigateToSchoolRegistration();
              }
            }

            if (success === 100) {
              of(addSchoolInfo({ school_info: info.data as ISchoolInfo }));
              this.navigateToDashboard();
            }
          }),
          catchError((error) => {
            this.schoolInfoService.errorToast(error);
            return of(
              isSchoolInfoLoading({ isSchoolInfoLoading: false }),
              checkModulesError({ message: error.toString() })
            );
          })
        )
      )
    );
  });

  // function to navigate to navigate to dashboard
  navigateToDashboard() {
    this.router.navigate(['/dashboard/academics']);
  }

  // function to navigate to school registration
  navigateToSchoolRegistration() {
    this.router.navigate(['/school-registration']);
  }
}
