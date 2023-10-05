import { createAction, props } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { INotification } from 'src/app/interfaces/notification.interface';
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

export const notificationBannerObserved = createAction(
  '[Dashboard] Notification Banner Observed',
  props<{ notification: INotification; }>()
)

export const loadClassEffect = createAction(
  '[Classes] Load Class Effect',
  props<{ class: IClass; }>()
);
