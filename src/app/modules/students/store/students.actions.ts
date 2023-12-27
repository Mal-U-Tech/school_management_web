import {
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { IStudentFilter } from '../interfaces/student_filter.interface';
import { IPayload } from 'src/app/interfaces/payload.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { InviteDTO } from 'src/app/dtos/invite.dto';

export const AddStudentActions = createActionGroup({
  source: 'Add Student Actions',
  events: {
    show: emptyProps(),
    submit: props<{ invite: InviteDTO; }>(),

    success: emptyProps(),
    failed: props<{ error: Error }>(),
  },
});

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
    page: props<Pick<IStudentFilter, 'page' | 'size'>>(),
  },
});
