import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { StudentService } from 'src/app/services/student.service';
import { loadClassEffect, loadClassStudentsEffectFailed, loadClassStudentsEffectSuccess, userClickClassExpandable } from './classes.actions';
import { catchError, exhaustMap, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { routerNavigatedAction } from '@ngrx/router-store';
import { selectCurrentSchool } from '../../schools/store/schools.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';

@Injectable()
export class ClassesEffects {
  constructor(
    private readonly actions$: Actions,

    private readonly store: Store,

    private readonly student: StudentService
  ) {}

  class$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userClickClassExpandable,
      ),
      exhaustMap(action => {
        return this.student.grades(action.class.school_id, action.class.students?.map(s => s.user_id) ?? []).pipe(
          map(students => loadClassStudentsEffectSuccess({ students })),
          catchError(error => of(loadClassStudentsEffectFailed({ error })))
        )
      })
    );
  });

  detail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(
        () => this.store.select(selectCurrentSchool),
      ),
      map(([{ payload }, school]) => {
        const url = payload.routerState.url;
        const [,,,,id,] = url.split('/');

        return school?.classes?.find((c) => c.id === id);
      }),
      filter((s) => !!s),
      map((c) => loadClassEffect({ class: c as IClass })),
    );
  });
}
