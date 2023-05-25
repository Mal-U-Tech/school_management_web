export interface ISubjects {
  _id?: string;
  name: string;
  department_id: string;
  level: string;
}

export interface ISubjectsArray {
  subjects: Array<ISubjects>;
}
