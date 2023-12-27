import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClassUpdateEffectActions, ClassUpdateTeacherActions } from '../classes.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class ClassTeacherEffects {

  constructor(
    private readonly actions$: Actions,
  ) {}

  teachersupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateTeacherActions.save),
      map((action) => ClassUpdateEffectActions.update({ class: action })),
    )
  });

  teacherremove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateTeacherActions.submit),
      map((action) => {
        const payload = {
          id: action.class.id,
          users: action.class?.users?.map(u => u.id)?.filter(u => u !== action.teacher) as string[],
        };
        return ClassUpdateEffectActions.update({ class: payload });
      })
    )
  });
}
