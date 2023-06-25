export interface IClassname {
  _id?: string;
  name: string;
}

export interface IClassnameArray {
  names: Array<IClassname>;
}

export interface IClassnamePaginatorResult {
  data: IClassname[];
  count: number;
  pageNo: number;
  totalPages: number;
  rows_per_page: number;
}

export interface IClassnamePostResult {
  success: number;
  message: string;
  data: IClassnameArray;
}
