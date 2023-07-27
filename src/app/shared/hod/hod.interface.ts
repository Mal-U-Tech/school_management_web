import { IDepartments } from '../add-departments/add-departments.interface';
import { ITeacher } from '../teacher/teacher.interface';

export interface IHOD {
  _id?: string;
  teacher_id: ITeacher;
  department_id: IDepartments;
  year: string;
}

export interface IHodPost {
  _id?: string;
  teacher_id: string;
  department_id: string;
  year: string;
}

export interface IHodGetResponse {
  data: IHOD[];
  count: number;
  totalPages: number;
  pageNo: number;
  rows_per_page: number;
}
