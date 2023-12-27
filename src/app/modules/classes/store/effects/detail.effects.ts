import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StudentService } from 'src/app/services/student.service';
import {
  ClassNameChangeActions,
  ClassStudentsEffectActions,
  ClassUpdateEffectActions,
} from '../classes.actions';
import { catchError, exhaustMap, filter, map, of, switchMap } from 'rxjs';
import { selectSchoolClasses } from '../classes.selectors';
import { routerNavigatedAction } from '@ngrx/router-store';
import { IClass } from 'src/app/interfaces/class.interface';
import { ClassService } from '../../services/class.service';

@Injectable()
export class ClassDetailEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,

    private readonly student: StudentService,
    private readonly service: ClassService,
  ) {}

  nameupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassNameChangeActions.submit),
      map((action) => ClassUpdateEffectActions.update({ class: action })),
    );
  });

  class$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateEffectActions.init),
      exhaustMap((action) => {
        if ((action.class?.students?.length ?? 0) < 1) {
          return of(ClassStudentsEffectActions.success({ students: [] }));
        }

        return this.student
          .grades(
            action.class.school_id,
            action.class.students?.map((s) => s.user_id) ?? []
          )
          .pipe(
            map((students) => ClassStudentsEffectActions.success({ students })),
            catchError((error) => of(ClassStudentsEffectActions.failed({ error })))
          );
      })
    );
  });

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateEffectActions.update),
      switchMap((action) => this.service.update(action.class).pipe(
        map((response) => ClassUpdateEffectActions.success({ class: response })),
        catchError((error) => of(ClassUpdateEffectActions.failed({ error })))
      ))
    )
  });

  detail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(selectSchoolClasses)),
      map(([{ payload }, classes]) => {
        const url = payload.routerState.url;
        const [, , , , class_id] = url.split('/');

        // then get the class
        return classes?.find((c) => c.id === class_id);
      }),
      filter((s) => !!s),
      map((c) => ClassUpdateEffectActions.init({ class: c as IClass }))
    );
  });
}
