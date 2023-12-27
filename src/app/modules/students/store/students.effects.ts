import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StudentService } from 'src/app/services/student.service';
import {
  AddStudentActions,
  StudentListPageActions,
  UpdateStudentFilterActions,
} from './students.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { selectStudentFilter } from './students.selectors';
import { selectSchoolEffect } from '../../schools/store/schools.actions';
import { AddStudentDialogComponent } from '../components/add-student-dialog/add-student-dialog.component';
import { DIALOG_WIDTH } from 'src/app/constants/dialog.constant';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentSchool } from '../../schools/store/schools.selectors';
import { UserService } from '../../authenticate/services/user/user.service';

@Injectable()
export class StudentsEffects {
  constructor(
    private readonly action$: Actions,

    private readonly store: Store,

    private readonly students: StudentService,
    private readonly users: UserService,
    private readonly dialog: MatDialog
  ) {}

  init$ = createEffect(() => {
    return this.action$.pipe(
      ofType(selectSchoolEffect),
      map(({ school }) => {
        return StudentListPageActions.init({
          school: school.id,
        });
      })
    );
  });

  update$ = createEffect(() => {
    return this.action$.pipe(
      ofType(
        StudentListPageActions.init,
        StudentListPageActions.search,
        StudentListPageActions.page
      ),
      concatLatestFrom(() => this.store.select(selectStudentFilter)),
      map(([updates, filter]) =>
        UpdateStudentFilterActions.update({
          filter: {
            ...filter,
            ...updates,
          },
        })
      )
    );
  });

  filterupdate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(UpdateStudentFilterActions.update),
      switchMap(({ filter }) => {
        return this.students.list(filter).pipe(
          map((payload) => UpdateStudentFilterActions.success({ payload })),
          catchError((error) =>
            of(UpdateStudentFilterActions.failed({ error }))
          )
        );
      })
    );
  });

  addstudentdialog$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AddStudentActions.show),
        concatLatestFrom(() => this.store.select(selectCurrentSchool)),
        map(([, school]) =>
          this.dialog.open(AddStudentDialogComponent, {
            width: DIALOG_WIDTH.medium,
            data: school,
          })
        )
      );
    },
    { dispatch: false }
  );

  submit$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AddStudentActions.submit),
      switchMap(({ invite }) => {
        return this.users.invite(invite).pipe(
          map(() => AddStudentActions.success()),
          catchError((error) => of(AddStudentActions.failed({ error })))
        )
      })
    )
  });

  updatestudents$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AddStudentActions.success),
      concatLatestFrom(() => this.store.select(selectStudentFilter)),
      map(([, filter]) => UpdateStudentFilterActions.update({ filter })),
    )
  });
}
