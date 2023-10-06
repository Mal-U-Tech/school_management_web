import { IStudent } from 'src/app/interfaces/student.interface';

export interface ClassState {
  students: IStudent[];
  class?: string;

  api: {
    loading: boolean;
    complete: boolean;
    error?: Error;
  };
}

export const initial: ClassState = {
  students: [],

  api: { loading: false, complete: false },
};
