import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StudentService } from 'src/app/services/student.service';
import { StudentListPageActions, UpdateStudentFilterActions } from './students.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { selectStudentFilter } from './students.selectors';
import { selectSchoolEffect } from '../../schools/store/schools.actions';

@Injectable()
export class StudentsEffects {

  constructor(
    private readonly action$: Actions,

    private readonly store: Store,

    private readonly service: StudentService,
  ) {}

  init$ = createEffect(() => {
    return this.action$.pipe(
      ofType(selectSchoolEffect),
      map(({ school }) => {
        return StudentListPageActions.init({
          school: school.id
        })
      })
    )
  });

  update$ = createEffect(() => {
    return this.action$.pipe(
      ofType(
        StudentListPageActions.init,
        StudentListPageActions.search
      ),
      concatLatestFrom(() => this.store.select(selectStudentFilter)),
      map(([updates, filter]) => UpdateStudentFilterActions.update({
        filter: {
          ...filter,
          ...updates
        }
      }))
    )
  });

  filterupdate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(UpdateStudentFilterActions.update),
      switchMap(({ filter }) => {
        return this.service.list(filter).pipe(
          map((payload) => UpdateStudentFilterActions.success({ payload })),
          catchError(error => of(UpdateStudentFilterActions.failed({ error })))
        )
      })
    )
  })
}
