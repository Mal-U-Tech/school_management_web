import { createAction, createActionGroup, props } from '@ngrx/store';
import { IStudentFilter } from '../interfaces/student_filter.interface';
import { IPayload } from 'src/app/interfaces/payload.interface';
import { IStudent } from 'src/app/interfaces/student.interface';

export const showAddStudentDialog = createAction(
  '[Students] Show Add Student Dialog'
);

export const UpdateStudentFilterActions = createActionGroup({
  source: 'Student Filter Effect',
  events: {
    update: props<{ filter: IStudentFilter }>(),

    success: props<{ payload: IPayload<IStudent> }>(),
    failed: props<{ error: Error }>(),
  },
});

export const StudentListPageActions = createActionGroup({
  source: 'Student List Page',
  events: {
    init: props<Pick<IStudentFilter, 'school'>>(),
    search: props<Pick<IStudentFilter, 'search'>>(),
  },
});
