import { createAction, props } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { IStudent } from 'src/app/interfaces/student.interface';

export const userClickClassExpandable = createAction(
  '[Classes] User Click Class Expandable',
  props<{ class: IClass }>()
);

export const loadClassStudentsEffectSuccess = createAction(
  '[Classes] Load Class Students Effect Success',
  props<{ students: IStudent[] }>()
);

export const loadClassStudentsEffectFailed = createAction(
  '[Classes] Load Class Students Effect Failed',
  props<{ error: Error }>()
);
