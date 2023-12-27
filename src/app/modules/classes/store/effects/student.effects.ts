import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClassUpdateEffectActions, ClassUpdateStudentActions } from '../classes.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class ClassStudentsEffects {

  constructor(
    private readonly actions$: Actions,
  ) {}

  studentsupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateStudentActions.save),
      map((action) => ClassUpdateEffectActions.update({ class: action })),
    )
  });

  studentremove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateStudentActions.submit),
      map((action) => {
        const payload = {
          id: action.class.id,
          students: action.class?.students?.filter(s => s.user_id !== action.student).map(s => s.user_id)
        }
        return ClassUpdateEffectActions.update({ class: payload });
      })
    )
  });
}
