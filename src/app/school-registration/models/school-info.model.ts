export interface ISchoolInfo {
  _id?: string;
  name: string;
  region?: string;
  administrators: {user: string}[];
  teachers: string[];
  email?: string;
}
