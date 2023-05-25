export interface IDepartments {
  _id?: string;
  name: string;
}

export interface IDepartmentsArray {
  names: Array<IDepartments>;
}
