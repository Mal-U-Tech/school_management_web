import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { StudentService } from 'src/app/services/student.service';
import {
  loadClassEffect,
  loadClassStudentsEffectFailed,
  loadClassStudentsEffectSuccess,
  updateClassEffectFailed,
  updateClassEffectSuccessful,
  userClickNameChangeSave,
  userClickRemoveClassSubject,
  userClickRemoveClassTeacher,
  userClickUpdateSubjectsSave,
  userClickUpdateTeachersSave,
} from './classes.actions';
import { catchError, exhaustMap, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { ClassService } from '../services/class.service';
import { selectSchoolClasses } from './classes.selectors';

@Injectable()
export class ClassesEffects {
  constructor(
    private readonly actions$: Actions,

    private readonly store: Store,

    private readonly student: StudentService,
    private readonly service: ClassService
  ) {}

  teachersupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userClickUpdateTeachersSave),
      exhaustMap((action) => {
        return this.service.update(action).pipe(
          map((response) => updateClassEffectSuccessful({ class: response })),
          catchError(error => of(updateClassEffectFailed({ error }))),
        )
      })
    )
  });

  teacherremove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userClickRemoveClassTeacher),
      exhaustMap((action) => {
        const payload = {
          id: action.class.id,
          users: action.class?.users?.map(u => u.id)?.filter(u => u !== action.teacher) as string[],
        };
        return this.service.update(payload).pipe(
          map((response) => updateClassEffectSuccessful({ class: response })),
          catchError(error => of(updateClassEffectFailed({ error })))
        )
      })
    )
  });

  subjectsupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userClickUpdateSubjectsSave),
      exhaustMap((action) => {
        return this.service.update(action).pipe(
          map((response) => updateClassEffectSuccessful({ class: response })),
          catchError((error) => of(updateClassEffectFailed({ error })))
        )
      })
    )
  });

  subjectremove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userClickRemoveClassSubject),
      exhaustMap((action) => {
        const payload = {
          id: action.class.id,
          subjects: action.class?.subjects?.filter(s => s.id !== action.subject).map(s => s.id)
        }
        return this.service.update(payload).pipe(
          map((response) => updateClassEffectSuccessful({ class: response })),
          catchError((error) => of(updateClassEffectFailed({ error })))
        )
      })
    )
  });

  nameupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userClickNameChangeSave),
      exhaustMap((action) => {
        return this.service.update(action).pipe(
          map((response) => updateClassEffectSuccessful({ class: response })),
          catchError((error) => of(updateClassEffectFailed({ error })))
        );
      })
    );
  });

  class$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadClassEffect),
      exhaustMap((action) => {
        return this.student
          .grades(
            action.class.school_id,
            action.class.students?.map((s) => s.user_id) ?? []
          )
          .pipe(
            map((students) => loadClassStudentsEffectSuccess({ students })),
            catchError((error) => of(loadClassStudentsEffectFailed({ error })))
          );
      })
    );
  });

  detail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(selectSchoolClasses)),
      map(([{ payload }, classes]) => {
        const url = payload.routerState.url;
        const [, , , , class_id] = url.split('/');
        console.log(class_id)

        // then get the class
        return classes?.find((c) => c.id === class_id);
      }),
      filter((s) => !!s),
      map((c) => loadClassEffect({ class: c as IClass }))
    );
  });
}
