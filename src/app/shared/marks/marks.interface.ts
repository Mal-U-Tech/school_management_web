export interface IMarks {
  _id?: string;
  class_student_id: string;
  subject_teacher_id: string;
  subject_id: string;
  mark: string;
  year: string;
  scoresheet_id: string;
  max_score: number;
  num_students: number;
}
