import { ISubjects } from '../add-subjects/add-subjects.interface';
import { IClassname } from '../classname/classname.interface';
import { IScoresheet } from '../scoresheet/scoresheet.interface';

export interface IReports {
  _id?: string;
  name: string;
  year: string;
  criteria: IReportsCriteria[];
}

export interface IReportsPostDTO {
  name: string;
  year: string;
  criteria: IReportsCriteriaPostDTO[];
}

export interface IReportsCriteria {
  scoresheets: IScoresheet[];
  classes: IClassname[];
  percentages: number[];
}

export interface IReportsCriteriaPostDTO {
  scoresheets: string[];
  classes: string[];
  percentages: number[];
}

// interface for report info for each leaner
export interface IReportsData {
  classname: IClassname;
  learners: {
    reportInfo: IReportMetaData;
    subjects: {
      name: ISubjects;
      marks: IReportMarks;
    }[];
  }[];
}

export interface IReportMarks {
  first: string;
  second: string;
  third: string;
  fourth: string;
  final_mark: number;
  position: number;
  category: string;
  comments: string;
  teacher: string;
}

export interface IReportMetaData {
  PASSFAIL: string;
  Class_Teacher: string;
  School_Reopens: string;
  id: string;
  Name: string;
  Form: string;
  Term: string;
  POSITION_in_Class: string;
  Num_of_Students: string;
  AGGREGATE: string;
  CLASS_AVERAGE: string;
  Num_of_Pass: string;
  Eng_PF: string;
  Attendance: string;
  Total_Days: string;
  Conduct: string;
  Class_teacher_s_remark: string;
  Head_teachers_remark: string;
  Staff_Resolution: string;
}
