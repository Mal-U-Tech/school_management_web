import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StudentService } from 'src/app/services/student.service';
import { loadClassStudentsEffectFailed, loadClassStudentsEffectSuccess, userClickClassExpandable } from './classes.actions';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ClassesEffects {
  constructor(
    private readonly actions$: Actions,

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
}
