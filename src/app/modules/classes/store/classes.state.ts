import { IClass } from "src/app/interfaces/class.interface";
import { IStudent } from "src/app/interfaces/student.interface";

export interface ClassState {
  students: IStudent[];
  class?: IClass;

  api: {
    loading: boolean;
    error?: Error;
  }
}

export const initial: ClassState = {
  students: [],

  api: { loading: false },
}
