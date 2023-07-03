export interface ISubjects {
  _id?: string;
  name: string;
  department_id: any;
  level: string;
  pass_mark: number;
}

export interface ISubjectsArray {
  subjects: Array<ISubjects>;
}

export interface ISubjectsGetResponse {
  data: ISubjects[];
  count: number;
  totalPages: number;
  pageNo: number;
  rows_per_page: number;
}

export interface ISubjectsPostResponse {
  success: number;
  message: string;
  data: ISubjects[];
}
