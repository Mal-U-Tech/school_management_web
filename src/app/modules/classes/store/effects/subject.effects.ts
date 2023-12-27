import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClassUpdateEffectActions, ClassUpdateSubjectActions } from '../classes.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class ClassSubjectEffects {

  constructor(
    private readonly actions$: Actions,
  ) {}

  subjectsupdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateSubjectActions.save),
      map((action) => ClassUpdateEffectActions.update({ class: action })),
    )
  });

  subjectremove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassUpdateSubjectActions.submit),
      map((action) => {
        const payload = {
          id: action.class.id,
          subjects: action.class?.subjects?.filter(s => s.id !== action.subject).map(s => s.id)
        }
        return ClassUpdateEffectActions.update({ class: payload });
      })
    )
  });
}
