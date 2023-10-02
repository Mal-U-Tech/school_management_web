import { IStudent } from "src/app/interfaces/student.interface";

export interface ClassState {
  students: IStudent[];

  api: {
    loading: boolean;
    error?: Error;
  }
}

export const initial: ClassState = {
  students: [],

  api: { loading: false },
}
