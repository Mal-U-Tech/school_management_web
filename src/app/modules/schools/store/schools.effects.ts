import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { selectAppSchools } from '../../../store/app.selectors';
import { loadSchoolEffect, routerUpdateTabEffect } from './schools.actions';
import { ISchool } from '../../../interfaces/school.interface';

@Injectable()
export class SchoolsEffects {
  constructor(
    private readonly actions$: Actions,

    private readonly store: Store,
  ) {}

  school$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(
        () => this.store.select(selectAppSchools),
      ),
      map(([{ payload }, schools]) => {
        const url = payload.routerState.url;
        const [,, id,] = url.split('/');

        return schools.find((s) => s.id === id);
      }),
      filter((s) => !!s),
      map((school) => loadSchoolEffect({ school: school as ISchool })),
    )
  });

  $tabs = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => {
        const url = payload.routerState.url;
        const [,,, tab,] = url.split('/');

        return tab
      }),
      filter((tab) => !!tab),
      map((tab) => routerUpdateTabEffect({ tab })),
    );
  });
}
