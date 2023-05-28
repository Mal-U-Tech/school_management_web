export interface ISubjects {
  _id?: string;
  name: string;
  department_id: string;
  level: string;
  pass_mark: number;
}

export interface ISubjectsArray {
  subjects: Array<ISubjects>;
}
