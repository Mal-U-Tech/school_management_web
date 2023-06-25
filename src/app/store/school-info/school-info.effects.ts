import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { UserApiService } from 'src/app/shared/user/user-api.service';
import { ICheckModulesResult, IUser } from 'src/app/shared/user/user.interface';
import { setUser } from '../user/user.actions';
import {
  addSchoolInfo,
  checkModulesError,
  checkModulesRequest,
  checkModulesSuccess,
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
          catchError((error) => {
            this.schoolInfoService.errorToast(error);
            return of(

              checkModulesError({ message: error.toString() })
            );
          })
        )
      ),
      switchMap((success) => {
        console.log(success as ICheckModulesResult);
        const modulesRes = success as ICheckModulesResult;
        // let res: EffectResult<Action>;

        if (
          modulesRes.missing.length &&
          modulesRes.missing[0].name === 'school-info'
        ) {
          this.navigateToSchoolRegistration();
          return of(
            isSchoolInfoLoading({ isSchoolInfoLoading: false }),
            checkModulesError({ message: 'School info not found' })
          );
        } else if(modulesRes.success === 100) {
          this.navigateToDashboard();
          return of(
            isSchoolInfoLoading({ isSchoolInfoLoading: false }),
            addSchoolInfo({ school_info: modulesRes.data })
          );
        }

        return of(isSchoolInfoLoading({isSchoolInfoLoading: false}));
      })
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
