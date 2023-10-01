import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IAttendanceConduct } from 'src/app/shared/attendance-conduct/attendance-conduct.interface';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import {
  IReportMarks,
  IReportsCriteria,
} from 'src/app/shared/reports/reports.interface';
import * as XLSX from 'xlsx';

export class ReportExcel {
  private classname: string;
  private reportData: any[];
  private excelData: any[] = [];
  private reportName: string;
  private year: string;
  private classTeacher: string;
  private classAttendance: IAttendanceConduct[] = [];
  private reportCriteria: IReportsCriteria;
  private secondaryRegEx = new RegExp('^Form [1-3].');
  private highSchoolRegEx = new RegExp('^Form [4-5].');


  constructor(
    reportName: string,
    className: string,
    data: any,
    year: string,
    classTeacher: string,
    classAttendance: IAttendanceConduct[],
    criteria: IReportsCriteria,
  ) {
    this.classname = className;
    this.reportData = data;
    this.reportName = reportName;
    this.year = year;
    this.classTeacher = classTeacher;
    this.classAttendance = classAttendance;
    this.reportCriteria = criteria;
  }

  // function to create new excel file
  createExcel() {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, this.formulateHeaders());

    XLSX.utils.sheet_add_json(ws, this.excelData, {
      origin: 'A2',
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, this.reportName);

    console.log('About to write excel file');
    XLSX.writeFile(wb, this.classname + ' ' + this.year + '.xlsx');
  }

  // function to add report data
  formulateData() {
    // console.log(chis.reportData.length);
    // console.log(new Date('11/09/2023').toLocaleDateString());
    // console.log();
    let index = 0;
    this.reportData.forEach((item) => {
      const tempItem = item.reportInfo;
      const attendance = this.classAttendance[index];
      let secondary = false;

      if(this.secondaryRegEx.test(tempItem.Form)){
        secondary = true;
      }
      // console.log((attendance.student as IClassStudent)._id! === tempItem.id);
      // console.log(attendance.attendance);
      // console.log(te);
      // console.log(tempItem);
      this.excelData.push({
        _id: tempItem.id,
        Name: tempItem.Name,
        Form: tempItem.Form,
        Term: tempItem.Term,
        Num_of_Students: this.reportData.length.toString(),
        Total_Days: 72, // tempItem.Total_Days,
        School_Reopens: new Date('11/09/2023').toLocaleDateString(),
        Class_Teacher: this.classTeacher,
        Attendance:(attendance.student as IClassStudent)._id || '' == tempItem.id
              ? attendance.attendance
              : '',
        Conduct:
          (attendance.student as IClassStudent)._id || '' === tempItem.id
            ? attendance.conduct + '. ' + attendance.comment
            : '',

        // sub 1
        Sub1_Name: '',
        Sub1_Content1: '',
        Sub1_Content2: '',
        Sub1_Content3: '',
        Sub1_Content4: '',
        Sub1_Final_Mark: '',
        Sub1_Position: {f: `=IF(P${index + 2}="","",RANK(P${index + 2}, P$2:P${this.reportData.length +2}))`},
        Sub1_Category: '',
        Sub1_Comments: '',
        Sub1_PF: this.computeSubjectPass('P', index, secondary),
        Sub1_Teacher: '',

        // sub 2
        Sub2_Name: '',
        Sub2_Content1: '',
        Sub2_Content2: '',
        Sub2_Content3: '',
        Sub2_Content4: '',
        Sub2_Final_Mark: '',
        Sub2_Position: {f: `=IF(AA${index + 2}="","",RANK(AA${index + 2}, AA$2:AA${this.reportData.length +2}))`},
        Sub2_Category: '',
        Sub2_Comments: '',
        Sub2_PF: this.computeSubjectPass('AA', index, secondary),
        Sub2_Teacher: '',

        // sub 3
        Sub3_Name: '',
        Sub3_Content1: '',
        Sub3_Content2: '',
        Sub3_Content3: '',
        Sub3_Content4: '',
        Sub3_Final_Mark: '',
        Sub3_Position: {f: `=IF(AL${index + 2}="","",RANK(AL${index + 2}, AL$2:AL${this.reportData.length +2}))`},
        Sub3_Category: '',
        Sub3_Comments: '',
        Sub3_PF: this.computeSubjectPass('AL', index, secondary),
        Sub3_Teacher: '',

        // sub 4
        Sub4_Name: '',
        Sub4_Content1: '',
        Sub4_Content2: '',
        Sub4_Content3: '',
        Sub4_Content4: '',
        Sub4_Final_Mark: '',
        Sub4_Position: {f: `=IF(AW${index + 2}="","",RANK(AW${index + 2}, AW$2:AW${this.reportData.length +2}))`},
        Sub4_Category: '',
        Sub4_Comments: '',
        Sub4_PF: this.computeSubjectPass('AW', index, secondary),
        Sub4_Teacher: '',

        // sub 5
        Sub5_Name: '',
        Sub5_Content1: '',
        Sub5_Content2: '',
        Sub5_Content3: '',
        Sub5_Content4: '',
        Sub5_Final_Mark:'',
        Sub5_Position: {f: `=IF(BH${index + 2}="","",RANK(BH${index + 2}, BH$2:BH${this.reportData.length +2}))`},
        Sub5_Category: '',
        Sub5_Comments: '',
        Sub5_PF: this.computeSubjectPass('BH', index, secondary),
        Sub5_Teacher: '',

        // sub 6
        Sub6_Name: '',
        Sub6_Content1: '',
        Sub6_Content2: '',
        Sub6_Content3: '',
        Sub6_Content4: '',
        Sub6_Final_Mark: '',
        Sub6_Position: {f: `=IF(BS${index + 2}="","",RANK(BS${index + 2}, BS$2:BS${this.reportData.length +2}))`},
        Sub6_Category: '',
        Sub6_Comments: '',
        Sub6_PF: this.computeSubjectPass('BS', index, secondary),
        Sub6_Teacher: '',

        // sub 7
        Sub7_Name: '',
        Sub7_Content1: '',
        Sub7_Content2: '',
        Sub7_Content3: '',
        Sub7_Content4: '',
        Sub7_Final_Mark: '',
        Sub7_Position: {f: `=IF(CD${index + 2}="","",RANK(CD${index + 2}, CD$2:CD${this.reportData.length +2}))`},
        Sub7_Category: '',
        Sub7_Comments: '',
        Sub7_PF: this.computeSubjectPass('CD', index, secondary),
        Sub7_Teacher: '',

        // sub 8
        Sub8_Name: '',
        Sub8_Content1: '',
        Sub8_Content2: '',
        Sub8_Content3: '',
        Sub8_Content4: '',
        Sub8_Final_Mark: '',
        Sub8_Position: {f: `=IF(CO${index + 2}="","",RANK(CO${index + 2}, CO$2:CO${this.reportData.length +2}))`},
        Sub8_Category: '',
        Sub8_Comments: '',
        Sub8_PF: this.computeSubjectPass('CO', index, secondary),
        Sub8_Teacher: '',

        // sub 9
        Sub9_Name: '',
        Sub9_Content1: '',
        Sub9_Content2: '',
        Sub9_Content3: '',
        Sub9_Content4: '',
        Sub9_Final_Mark: '',
        Sub9_Position: {f: `=IF(CZ${index + 2}="","",RANK(CZ${index + 2}, CZ$2:CZ${this.reportData.length +2}))`},
        Sub9_Category: '',
        Sub9_Comments: '',
        Sub9_PF: this.computeSubjectPass('CZ', index, secondary),
        Sub9_Teacher: '',

        // sub 10
        Sub10_Name: '',
        Sub10_Content1: '',
        Sub10_Content2: '',
        Sub10_Content3: '',
        Sub10_Content4: '',
        Sub10_Final_Mark: '',
        Sub10_Position: {f: `=IF(DK${index + 2}="","",RANK(DK${index + 2}, DK$2:DK${this.reportData.length +2}))`},
        Sub10_Category: '',
        Sub10_Comments: '',
        Sub10_PF: this.computeSubjectPass('DK', index, secondary),
        Sub10_Teacher: '',

        // sub 11
        Sub11_Name: '',
        Sub11_Content1: '',
        Sub11_Content2: '',
        Sub11_Content3: '',
        Sub11_Content4: '',
        Sub11_Final_Mark: '',
        Sub11_Position: {f: `=IF(DV${index + 2}="","",RANK(DV${index + 2}, DV$2:DV${this.reportData.length +2}))`},
        Sub11_Category: '',
        Sub11_Comments: '',
        Sub11_PF: this.computeSubjectPass('DV', index, secondary),
        Sub11_Teacher: '',

        // sub 12
        Sub12_Name: '',
        Sub12_Content1: '',
        Sub12_Content2: '',
        Sub12_Content3: '',
        Sub12_Content4: '',
        Sub12_Final_Mark: '',
        Sub12_Position: {f: `=IF(EG${index + 2}="","",RANK(EG${index + 2}, EG$2:EG${this.reportData.length +2}))`},
        Sub12_Category: '',
        Sub12_Comments: '',
        Sub12_PF: this.computeSubjectPass('EG', index, secondary),
        Sub12_Teacher: '',

        // sub 13
        Sub13_Name: '',
        Sub13_Content1: '',
        Sub13_Content2: '',
        Sub13_Content3: '',
        Sub13_Content4: '',
        Sub13_Final_Mark: '',
        Sub13_Position: {f: `=IF(ER${index + 2}="","",RANK(ER${index + 2}, ER$2:ER${this.reportData.length +2}))`},
        Sub13_Category: '',
        Sub13_Comments: '',
        Sub13_PF: this.computeSubjectPass('ER', index, secondary),
        Sub13_Teacher: '',

        // sub 14
        Sub14_Name: '',
        Sub14_Content1: '',
        Sub14_Content2: '',
        Sub14_Content3: '',
        Sub14_Content4: '',
        Sub14_Final_Mark: '',
        Sub14_Position: {f: `=IF(FC${index + 2}="","",RANK(FC${index + 2}, FC$2:FC${this.reportData.length +2}))`},
        Sub14_Category: '',
        Sub14_Comments: '',
        Sub14_PF: this.computeSubjectPass('FC', index, secondary),
        Sub14_Teacher: '',

        AGGREGATE: {f: `=IF(B${index+2}="","",AVERAGE(P${index+2},AA${index+2},AL${index+2},AW${index+2},BH${index+2},BS${index+2},CD${index+2},CO${index+2},CZ${index+2},DK${index+2},DV${index+2},EG${index+2},ER${index+2},FC${index+2}))`},
        Class_teacher_s_remark: `=IF(FI${index+2}="","",IF(FI${index+2}<=49,"Below average",IF(FI${index+2}<=59,"Fair",IF(FI${index+2}<=69,"Good",IF(FI${index+2}<=79,"Very good",IF(FI${index+2}<=100,"Excellent",""))))))`,
        POSITION_in_class: `=IF($FI${index+2}="","",RANK(FI${index+2},$FI$${index+2}:$FI$${this.reportData.length + 2},0))`,
        CLASS_AVERAGE: `=IF(OR($B${index+2}="",COUNT($FI$${index+2}:$FI$${this.reportData.length})=0),"",ROUND(AVERAGE($FI$${index+2}:$FI$${this.reportData.length}),1))`,
        Num_of_Pass: `=IF($B${index+2}="","",COUNTIF(K${index+2}:FG${index+2},"P"))` ,
        Pass_5_sub_or_Pass_6_sub: this.checkNumPassSubsCriteria(index, secondary),
        Eng_PF: `=IF($B${index+2}="","",IF($T8="P","OK","NG"))`,
        Agg_min: this.calculateAggregateMin(index, secondary),
        PASSFAIL: `=IF($B${index+2}="","",IF(AND(FN${index+2}="OK",FO${index+2}="OK",FP${index+2}="OK"),"PASS","FAIL"))`,
        Staff_Resolution: '-',
        Head_teachers_remark: `=IF(FI${index+2}<=49, "Fail, work hard", "Pass, good work")`,
      });

      // for each subject add the marks and other information
      // item.subjects.forEach((subject: any) => {
      //
      // });
      for (let i = 0; i < item.subjects.length; i++) {
        const subject: { name: ISubjects; marks: IReportMarks } =
          item.subjects[i];

        const finalMark = this.calculateFinalMark(
            subject.marks.first,
            subject.marks.second,
            subject.marks.third,
            subject.marks.fourth,
          );


        if (i === 0) {
          this.excelData[index].Sub1_Name = subject.name.name;
          this.excelData[index].Sub1_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub1_Content2 =
            subject.marks['second'] == '' ? '' : subject.marks['second'];
          this.excelData[index].Sub1_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub1_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub1_Teacher = subject.marks.teacher;
          this.excelData[index].Sub1_Final_Mark =  finalMark;
          this.excelData[index].Sub1_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub1_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 1) {
          this.excelData[index].Sub2_Name = subject.name.name;
          this.excelData[index].Sub2_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub2_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub2_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub2_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub2_Teacher = subject.marks.teacher;
          this.excelData[index].Sub2_Final_Mark = finalMark;
          this.excelData[index].Sub2_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub2_Comments = this.computeSubjectComment(finalMark);

        } else if (i === 2) {
          this.excelData[index].Sub3_Name = subject.name.name;
          this.excelData[index].Sub3_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub3_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub3_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub3_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub3_Teacher = subject.marks.teacher;
          this.excelData[index].Sub3_Final_Mark = finalMark;
          this.excelData[index].Sub3_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub3_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 3) {
          this.excelData[index].Sub4_Name = subject.name.name;
          this.excelData[index].Sub4_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub4_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub4_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub4_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub4_Teacher = subject.marks.teacher;
          this.excelData[index].Sub4_Final_Mark = finalMark;
          this.excelData[index].Sub4_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub4_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 4) {
          this.excelData[index].Sub5_Name = subject.name.name;
          this.excelData[index].Sub5_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub5_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub5_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub5_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub5_Teacher = subject.marks.teacher;
          this.excelData[index].Sub5_Final_Mark = finalMark;
          this.excelData[index].Sub5_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub5_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 5) {
          this.excelData[index].Sub6_Name = subject.name.name;
          this.excelData[index].Sub6_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub6_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub6_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub6_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub6_Teacher = subject.marks.teacher;
          this.excelData[index].Sub6_Final_Mark = finalMark;
          this.excelData[index].Sub6_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub6_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 6) {
          this.excelData[index].Sub7_Name = subject.name.name;
          this.excelData[index].Sub7_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub7_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub7_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub7_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub7_Teacher = subject.marks.teacher;
          this.excelData[index].Sub7_Final_Mark = finalMark;
          this.excelData[index].Sub7_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub7_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 7) {
          this.excelData[index].Sub8_Name = subject.name.name;
          this.excelData[index].Sub8_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub8_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub8_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub8_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub8_Teacher = subject.marks.teacher;
          this.excelData[index].Sub8_Final_Mark = finalMark;
          this.excelData[index].Sub8_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub8_Comments = this.computeSubjectComment(finalMark);

        } else if (i === 8) {
          this.excelData[index].Sub9_Name = subject.name.name;
          this.excelData[index].Sub9_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub9_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub9_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub9_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub9_Teacher = subject.marks.teacher;
          this.excelData[index].Sub9_Final_Mark = finalMark;
          this.excelData[index].Sub9_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub9_Comments = this.computeSubjectComment(finalMark);

        } else if (i === 9) {
          this.excelData[index].Sub10_Name = subject.name.name;
          this.excelData[index].Sub10_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub10_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub10_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub10_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub10_Teacher = subject.marks.teacher;
          this.excelData[index].Sub10_Final_Mark =  finalMark;
          this.excelData[index].Sub10_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub10_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 10) {
          this.excelData[index].Sub11_Name = subject.name.name;
          this.excelData[index].Sub11_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub11_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub11_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub11_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub11_Teacher = subject.marks.teacher;
          this.excelData[index].Sub11_Final_Mark = finalMark;
          this.excelData[index].Sub11_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub11_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 11) {
          this.excelData[index].Sub12_Name = subject.name.name;
          this.excelData[index].Sub12_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub12_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub12_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub12_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub12_Teacher = subject.marks.teacher;
          this.excelData[index].Sub12_Final_Mark = finalMark;
          this.excelData[index].Sub12_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub12_Comments = this.computeSubjectComment(finalMark);

        } else if (i === 12) {
          this.excelData[index].Sub13_Name = subject.name.name;
          this.excelData[index].Sub13_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub13_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub13_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub13_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub13_Teacher = subject.marks.teacher;
          this.excelData[index].Sub13_Final_Mark = finalMark;
          this.excelData[index].Sub13_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub13_Comments = this.computeSubjectComment(finalMark);
        } else if (i === 13) {
          this.excelData[index].Sub14_Name = subject.name.name;
          this.excelData[index].Sub14_Content1 =
            subject.marks['first'] == '' ? '' : subject.marks['first'];
          this.excelData[index].Sub14_Content2 =
            subject.marks.second == '' ? '' : subject.marks.second;
          this.excelData[index].Sub14_Content3 =
            subject.marks.third == '' ? '' : subject.marks.third;
          this.excelData[index].Sub14_Content4 =
            subject.marks.fourth == '' ? '' : subject.marks.fourth;
          this.excelData[index].Sub14_Teacher = subject.marks.teacher;
          this.excelData[index].Sub14_Final_Mark =  finalMark;
          this.excelData[index].Sub14_Category = this.computeCategory(finalMark);
          this.excelData[index].Sub14_Comments = this.computeSubjectComment(finalMark);
        }
      }

      index++;
    });
    // console.log(`This is excel data`);
    // console.log(this.excelData);
  }

  // function to formulate headers
  formulateHeaders() {
    return [
      [
        '_id',
        'Name',
        'Form',
        'Term',
        'Num_of_Students',
        'Total_Days',
        'School_Reopens',
        'Class_Teacher',
        'Attendance',
        'Conduct',
        // sub 1
        'Sub1_Name',
        'Sub1_Content1',
        'Sub1_Content2',
        'Sub1_Content3',
        'Sub1_Content4',
        'Sub1_Final Mark',
        'Sub1_Position',
        'Sub1_Category',
        'Sub1_Comments',
        'Sub1_P/F',
        'Sub1_Teacher',

        // sub 2
        'Sub2_Name',
        'Sub2_Content1',
        'Sub2_Content2',
        'Sub2_Content3',
        'Sub2_Content4',
        'Sub2_Final Mark',
        'Sub2_Position',
        'Sub2_Category',
        'Sub2_Comments',
        'Sub2_P/F',
        'Sub2_Teacher',

        // sub 3
        'Sub3_Name',
        'Sub3_Content1',
        'Sub3_Content2',
        'Sub3_Content3',
        'Sub3_Content4',
        'Sub3_Final Mark',
        'Sub3_Position',
        'Sub3_Category',
        'Sub3_Comments',
        'Sub3_P/F',
        'Sub3_Teacher',

        // sub 4
        'Sub4_Name',
        'Sub4_Content1',
        'Sub4_Content2',
        'Sub4_Content3',
        'Sub4_Content4',
        'Sub4_Final Mark',
        'Sub4_Position',
        'Sub4_Category',
        'Sub4_Comments',
        'Sub4_P/F',
        'Sub4_Teacher',

        // sub 5
        'Sub5_Name',
        'Sub5_Content1',
        'Sub5_Content2',
        'Sub5_Content3',
        'Sub5_Content4',
        'Sub5_Final Mark',
        'Sub5_Position',
        'Sub5_Category',
        'Sub5_Comments',
        'Sub5_P/F',
        'Sub5_Teacher',

        // sub 6
        'Sub6_Name',
        'Sub6_Content1',
        'Sub6_Content2',
        'Sub6_Content3',
        'Sub6_Content4',
        'Sub6_Final Mark',
        'Sub6_Position',
        'Sub6_Category',
        'Sub6_Comments',
        'Sub6_P/F',
        'Sub6_Teacher',

        // sub 7
        'Sub7_Name',
        'Sub7_Content1',
        'Sub7_Content2',
        'Sub7_Content3',
        'Sub7_Content4',
        'Sub7_Final Mark',
        'Sub7_Position',
        'Sub7_Category',
        'Sub7_Comments',
        'Sub7_P/F',
        'Sub7_Teacher',

        // sub 8
        'Sub8_Name',
        'Sub8_Content1',
        'Sub8_Content2',
        'Sub8_Content3',
        'Sub8_Content4',
        'Sub8_Final Mark',
        'Sub8_Position',
        'Sub8_Category',
        'Sub8_Comments',
        'Sub8_P/F',
        'Sub8_Teacher',

        // sub 9
        'Sub9_Name',
        'Sub9_Content1',
        'Sub9_Content2',
        'Sub9_Content3',
        'Sub9_Content4',
        'Sub9_Final Mark',
        'Sub9_Position',
        'Sub9_Category',
        'Sub9_Comments',
        'Sub9_P/F',
        'Sub9_Teacher',

        // sub 10
        'Sub10_Name',
        'Sub10_Content1',
        'Sub10_Content2',
        'Sub10_Content3',
        'Sub10_Content4',
        'Sub10_Final Mark',
        'Sub10_Position',
        'Sub10_Category',
        'Sub10_Comments',
        'Sub10_P/F',
        'Sub10_Teacher',

        // sub 11
        'Sub11_Name',
        'Sub11_Content1',
        'Sub11_Content2',
        'Sub11_Content3',
        'Sub11_Content4',
        'Sub11_Final Mark',
        'Sub11_Position',
        'Sub11_Category',
        'Sub11_Comments',
        'Sub11_P/F',
        'Sub11_Teacher',

        // sub 12
        'Sub12_Name',
        'Sub12_Content1',
        'Sub12_Content2',
        'Sub12_Content3',
        'Sub12_Content4',
        'Sub12_Final Mark',
        'Sub12_Position',
        'Sub12_Category',
        'Sub12_Comments',
        'Sub12_P/F',
        'Sub12_Teacher',

        // sub 13
        'Sub13_Name',
        'Sub13_Content1',
        'Sub13_Content2',
        'Sub13_Content3',
        'Sub13_Content4',
        'Sub13_Final Mark',
        'Sub13_Position',
        'Sub13_Category',
        'Sub13_Comments',
        'Sub13_P/F',
        'Sub13_Teacher',

        // sub 14
        'Sub14_Name',
        'Sub14_Content1',
        'Sub14_Content2',
        'Sub14_Content3',
        'Sub14_Content4',
        'Sub14_Final Mark',
        'Sub14_Position',
        'Sub14_Category',
        'Sub14_Comments',
        'Sub14_P/F',
        'Sub14_Teacher',

        'AGGREGATE',
        'Class_teacher_s_remark',
        'POSITION in Class',
        'CLASS_AVERAGE',
        'Num_of_Pass',
        'Pass 5 sub or Pass 6 sub',
        'Eng PF',
        'Agg_min',
        'PASSFAIL',
        'Staff_Resolution',
        'Head_teachers_remark',
      ],
    ];
  }

  calculateFinalMark(first: any, second: any, third: any, fourth: any) {
    let final: any;
    if (first != '') {
      first =
        (Number.parseInt(first) * this.reportCriteria.percentages[0]) / 100;
      final = Math.round(first);
      if (second != '') {
        second =
          (Number.parseInt(second) * this.reportCriteria.percentages[1]) / 100;
        final = Math.round(first + second);
        if (third != '') {
          third =
            (Number.parseInt(third) * this.reportCriteria.percentages[2]) / 100;
          final = Math.round(first + second + third);

          if (fourth != '') {
            fourth = (
              (Number.parseInt(fourth) * this.reportCriteria.percentages[3]) /
              100
            ).toString();
            final = Math.round(first + second + third + fourth);
          }
        }
      }
    }

    return final;
  }

  computeCategory(finalMark: number){
    if(finalMark <= 19){
      return 'U';
    }else if(finalMark <=29) {
      return 'G';
    } else if(finalMark <= 39) {
      return 'F';
    } else if(finalMark <= 49) {
      return 'E';
    } else if(finalMark <= 59) {
      return 'D';
    } else if(finalMark <= 69) {
      return 'C';
    } else if(finalMark <= 79) {
      return 'B';
    } else if(finalMark <= 89) {
      return 'A';
    }else if(finalMark <= 100) {
      return 'A+';
    }else{
      return '';
    }
  }

  computeSubjectComment(finalMark: number){
    if(finalMark <= 49){
      return "Below average";
    }else if(finalMark <= 59){
      return "Fair";
    } else if(finalMark <= 69){
      return "Good";
    }else if(finalMark <= 79){
      return "Very good";
    }else if(finalMark <=100){
      return "Excellent";
    }else{
      return '';
    }
  }

  computeSubjectPass(cell: string, index: number, secondary: boolean) {
    if(secondary){
      return `=IF(or($B${index+2}="",${cell}${index+2}=""),"",if(${cell}${index+2}>=${cell === "p" ? 55 : 50},"P","F"))`
    }else{
      return `=IF(OR($B${index+2}="",${cell}${index+2}=""),"",IF(${cell}${index+2}>=60,"P","F"))`
    }
  }

  checkNumPassSubsCriteria(index: number, secondary: boolean) {
    if(secondary) {
      return `=IF($B${index+2}="","",IF(FM${index+2}>=5,"OK","NG"))`;
    }else{
      return `=IF($B${index+2}="","",IF(FM${index+2}>=6,"OK","NG"))`;
    }
  }

  calculateAggregateMin(index: number, secondary: boolean){
    if(secondary) {
      return `=IF($B${index+2}="","",IF(FI2>=50,"OK","NG"))`;
    }else{
      return `=IF($B${index+2}="","",IF(FI2>=60,"OK","NG"))`;
    }
  }

}
