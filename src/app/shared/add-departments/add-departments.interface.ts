export interface IDepartments {
  _id?: string;
  name: string;
}

export interface IDepartmentsArray {
  names: Array<IDepartments>;
}

export interface IDepartmentsGetResponse {
  data: IDepartments[];
  count: number;
  pageNo: number;
  totalPages: number;
  row_per_page: number;
}

export interface IDepartmentsPostResult {
  success: number;
  message: string;
  data: IDepartments[];
}
