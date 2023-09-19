
export interface ISchoolInfo {
  _id?: string;
  name: string;
  region?: string;
  administrators?: { user: string }[];
  teachers?: { teacher: string }[];
  email?: string;
}
