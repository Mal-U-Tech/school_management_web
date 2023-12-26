import { DEFAULT_FILTER, IFilter } from "src/app/interfaces/filter.interface";

export interface IStudentFilter extends IFilter {
  school: string;
}

export const DEFAULT_STUDENT_FILTER: IStudentFilter = {
  ...DEFAULT_FILTER,
  school: '',
}
