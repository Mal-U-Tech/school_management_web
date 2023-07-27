export interface IClassStudent {
  _id?: string;
  name: string;
  surname: string;
  student_contact: string;
  year: string;
  gender: string;
  class_id: string;
}

export interface IClassStudentPostResponse {
  success: number;
  message: string;
  data: IClassStudent[];
}

export interface IClassStudentGetResponse {
  data: IClassStudent[];
  count: number;
  pageNo: number;
  totalPages: number;
  rows_per_page: number;
}
