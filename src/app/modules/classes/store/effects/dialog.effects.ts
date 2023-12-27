import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ClassDetailPageActions, ClassUpdateStudentActions, ClassUpdateSubjectActions, ClassUpdateTeacherActions } from '../classes.actions';
import { map } from 'rxjs/operators';
import { AddStudentDialogComponent } from 'src/app/modules/students/components/add-student-dialog/add-student-dialog.component';
import { DIALOG_WIDTH } from 'src/app/constants/dialog.constant';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentSchool } from 'src/app/modules/schools/store/schools.selectors';
import { selectCurrentClass } from '../classes.selectors';
import { NameDialogComponent } from '../../components/name-dialog/name-dialog.component';
import { UpdateSubjectsDialogComponent } from '../../components/update-subjects-dialog/update-subjects-dialog.component';
import { UpdateTeachersDialogComponent } from '../../components/update-teachers-dialog/update-teachers-dialog.component';
import { UpdateStudentsDialogComponent } from '../../components/update-students-dialog/update-students-dialog.component';
import { RemoveSubjectDialogComponent } from '../../components/remove-subject-dialog/remove-subject-dialog.component';
import { RemoveTeacherDialogComponent } from '../../components/remove-teacher-dialog/remove-teacher-dialog.component';
import { RemoveStudentDialogComponent } from '../../components/remove-student-dialog/remove-student-dialog.component';

@Injectable()
export class ClassDialogEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,

    private readonly dialog: MatDialog
  ) {}

  addstudent$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ClassDetailPageActions.addstudent),
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

  changename$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassDetailPageActions.changename),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([, value]) => this.dialog.open(NameDialogComponent, {
        data: value,
        width: DIALOG_WIDTH.small,
      }))
    )
  }, { dispatch: false });

  updatesubject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateSubjectActions.update),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([, value]) => this.dialog.open(UpdateSubjectsDialogComponent, {
        data: value,
        width: DIALOG_WIDTH.medium,
      }))
    )
  }, { dispatch: false });

  removesubject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateSubjectActions.remove),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([{ subject }, value]) => this.dialog.open(RemoveSubjectDialogComponent, {
        data: {
          class: value,
          subject,
        },
        width: DIALOG_WIDTH.small,
      }))
    )
  }, { dispatch: false });

  updateteacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateTeacherActions.update),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([, value]) => this.dialog.open(UpdateTeachersDialogComponent, {
        data: value,
        width: DIALOG_WIDTH.medium,
      }))
    )
  }, { dispatch: false });

  removeteacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateTeacherActions.remove),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([{ teacher }, value]) => this.dialog.open(RemoveTeacherDialogComponent, {
        data: {
          class: value,
          teacher,
        },
        width: DIALOG_WIDTH.small,
      }))
    )
  }, { dispatch: false });

  updatestudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateStudentActions.update),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([, value]) => this.dialog.open(UpdateStudentsDialogComponent, {
        data: value,
        width: DIALOG_WIDTH.medium,
      }))
    )
  }, { dispatch: false });

  removestudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateStudentActions.remove),
      concatLatestFrom(() => this.store.select(selectCurrentClass)),
      map(([{ student }, value]) => this.dialog.open(RemoveStudentDialogComponent, {
        data: {
          class: value,
          student,
        },
        width: DIALOG_WIDTH.small,
      }))
    )
  }, { dispatch: false });
}
