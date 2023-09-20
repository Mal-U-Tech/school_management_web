import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap } from 'rxjs';
import {
  addSchoolInfo,
  checkModulesError,
  checkModulesRequest,
  isSchoolInfoLoading,
} from './school-info.actions';
import { UserService } from 'src/app/modules/authenticate/services/user/user.service';

@Injectable()
export class SchoolInfoEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly schoolInfoService: UserService,
    private readonly router: Router
  ) {}

  // function to navigate to navigate to dashboard
  navigateToDashboard() {
    this.router.navigate(['/dashboard/academics']);
  }

  // function to navigate to school registration
  navigateToSchoolRegistration() {
    this.router.navigate(['/school-registration']);
  }
}
