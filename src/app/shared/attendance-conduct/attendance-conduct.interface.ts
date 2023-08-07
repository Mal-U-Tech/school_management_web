import { IClassStudent } from "../class-students/class-students.interface";
import { IClassname } from "../classname/classname.interface";
import { IReports } from "../reports/reports.interface";

export interface IAttendanceConduct {
  report: string | IReports;
  classname: string | IClassname;
  student: string | IClassStudent;
  attendance: string;
  conduct: string;
  comment: string;
}


export interface IAttendanceConductPostResponse {
  success: number;
  message: string;
}
