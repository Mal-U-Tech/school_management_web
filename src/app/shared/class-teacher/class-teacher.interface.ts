import { IClassname } from '../classname/classname.interface';
import { ITeacher } from '../teacher/teacher.interface';

export interface IClassTeacher {
  _id?: string;
  teacher_id: ITeacher | string;
  class_id: IClassname | string;
  year: string;
}
