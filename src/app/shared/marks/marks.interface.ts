import { ISubject } from 'src/app/add-subjects/models/subject.model';
import { IClassStudent } from '../class-students/class-students.interface';
import { ISubjectTeacher } from '../subject-teacher/subject-teacher.interface';

export interface IMarks {
  _id?: string;
  class_student_id: string | IClassStudent;
  subject_teacher_id: string | ISubjectTeacher;
  subject_id: string | ISubject;
  mark: string;
  year: string;
  scoresheet_id: string;
  max_score: number;
  num_students: number;
}
