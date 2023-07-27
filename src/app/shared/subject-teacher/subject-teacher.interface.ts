export interface ISubjectTeacher {
  _id?: string;
  subject_id: any;
  teacher_id: any;
  class_id: any;
  year: string;
}

export interface ISubjectTeacherGetResponse {
  data: ISubjectTeacher[];
  count: number;
  pageNo: number;
  totalPages: number;
  rows_per_page: number;
}
