import { createAction, props } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { INotification } from 'src/app/interfaces/notification.interface';
import { IStudent } from 'src/app/interfaces/student.interface';

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

export const userClickNameChangeSave = createAction(
  '[Classes] User Click Name Change Save',
  props<{ name: string; id: string; }>()
)

export const updateClassEffectSuccessful = createAction(
  '[Classes] Update Class Effect Successful',
  props<{ class: IClass }>()
)

export const updateClassEffectFailed = createAction(
  '[Classes] Update Class Effect Failed',
  props<{ error: Error }>()
);

export const nameChangeDialogClose = createAction(
  '[Classes] Name Change Dialog Close'
);

export const removeSubjectDialogClose = createAction(
  '[Classes] Remove Subject Dialog Close',
);

export const removeTeacherDialogClose = createAction(
  '[Classes] Remove Teacher Dialog Close'
);

export const updateSubjectsDialogClose = createAction(
  '[Classes] Update Subjects Dialog Close'
);

export const updateTeachersDialogClose = createAction(
  '[Classes] Update Teachers Dialog Close'
);

export const userClickRemoveClassSubject = createAction(
  '[Classes] User Click Remove Class Subject',
  props<{ subject: string; class: IClass; }>()
)

export const userClickUpdateSubjectsSave = createAction(
  '[Classes] User Click Update Subjects Save',
  props<{ id: string; subjects: string[]; }>()
)

export const userClickRemoveClassTeacher = createAction(
  '[Classes] User Click Remove Class Teacher',
  props<{ teacher: string; class: IClass }>()
)

export const userClickUpdateTeachersSave = createAction(
  '[Classes] User Click Update Teachers Save',
  props<{ id: string, users: string[]; }>()
)
