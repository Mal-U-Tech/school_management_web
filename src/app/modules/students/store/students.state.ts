import { IPayload } from 'src/app/interfaces/payload.interface';
import { DEFAULT_STUDENT_FILTER, IStudentFilter } from '../interfaces/student_filter.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { IApi } from 'src/app/interfaces/api.interface';

export interface StudentsState {
  filter: IStudentFilter;
  api: IApi;

  students: IPayload<IStudent>;
}

export const initial: StudentsState = {
  filter: DEFAULT_STUDENT_FILTER,
  api: {
    loading: false,
    complete: false,
  },
  students: {
    count: 0,
    data: [],
  },
};
