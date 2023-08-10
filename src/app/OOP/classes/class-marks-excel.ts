import { STUDENT } from 'src/app/scoresheet/create-scoresheet/add-marks/add-marks.component';
import * as XLSX from 'xlsx';

export class ClassMarksExcel {
  private data: any[] = [];
  private subTeacher = '';
  private subject = '';
  private passMark = '';
  private maxStudents = '';
  private students: STUDENT[] = [];
  private maxMark = '';
  private className = '';
  private marks = [];
  public res: any;
  private addedMarks: number[] = [];

  constructor(
    teacher: string,
    subject: string,
    passMark: string,
    maxStudents: string,
    students: STUDENT[],
    maxMark: string,
    className: string,
  ) {
    this.subTeacher = teacher;
    this.subject = subject;
    this.passMark = passMark;
    this.maxStudents = maxStudents;
    this.maxMark = maxMark;
    this.students = students;
    this.className = className;
  }

  // formulate headers for excel file
  formulateHeaders() {
    return [
      [this.subject, this.subTeacher],
      ['Pass Mark', this.passMark],
      [],
      ['Number of students', this.maxStudents],
      ['Max Score', this.maxMark],
      ['_id', 'Name', 'Score', 'Percentage'],
    ];
  }

  // formulate data for the class excel file
  formulateData() {
    for (let i = 0; i < this.students.length; i++) {
      console.log(this.students[i]);
      const student = this.students[i];
      this.data.push({
        _id: student._id,
        Name: student.surname + ' ' + student.name,
        Score: student.score,
        Percentage: {
          f: `=IF($C${i + 7}="", "", IF(C${i + 7}="nm",0,IF(C${
            i + 7
          }/B$5*100<1,0,ROUND(C${i + 7}/B$5*100,0))))`,
        },
      });
    }
  }

  // function to export to PDF
  createExcel() {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, this.formulateHeaders());

    XLSX.utils.sheet_add_json(ws, this.data, {
      origin: 'A7',
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, this.subject);
    XLSX.writeFile(wb, this.className + ' ' + this.subject + '.xlsx');
  }

  // function to read excel sheet with marks
  readMarks(event: any, subs: any[]) {
    let arrayBuffer: any;
    let workbook: any;
    const file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file!);
    fileReader.onload = () => {
      arrayBuffer = fileReader.result;
      const dat = new Uint8Array(arrayBuffer);
      const arr = [];

      for (let i = 0; i != dat.length; ++i) {
        arr[i] = String.fromCharCode(dat[i]);
      }

      const bstr = arr.join('');
      workbook = XLSX.read(bstr, { type: 'binary' });

      console.log(workbook.SheetNames);
      this.marks = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        {
          raw: true,
        },
      );

      this.assignMarksToStudents(subs);
    };
  }

  // lets assign marks to students in array
  assignMarksToStudents(subjects: any[]) {
    console.log(subjects);
    console.log(this.marks[2][this.subTeacher]);

    for (let i = 0; i < subjects.length; i++) {
      const stud = subjects[i];

      // console.log(stud._id + ' ' + this.marks[i + 4][this.subject]);
      if (subjects[i]._id == this.marks[i + 4][this.subject]) {
        if (this.marks[i + 4]['__EMPTY'] != null) {
          // check nm or NM
          if (
            this.marks[i + 4]['__EMPTY'] == 'nm' ||
            this.marks[i + 4]['__EMPTY'] == 'NM'
          ) {
            subjects[i].score = 0;
            this.addedMarks.push(0);
            subjects[i].percentage = 0;
          } else {
            if (this.marks[i + 4]['__EMPTY'] != '') {
              // assign score
              subjects[i].score = this.marks[i + 4]['__EMPTY'];
              this.addedMarks.push(
                Number.parseInt(this.marks[i + 4]['__EMPTY']),
              );

              // calculate and assign percentage
              subjects[i].percentage = Math.round(
                (Number.parseInt(subjects[i].score) /
                  Number.parseInt(this.marks[2][this.subTeacher])) *
                  100,
              );
            }
          }
        }
      }
    }

    this.res = {
      numStudents: this.marks[1][this.subTeacher],
      maxScore: this.marks[2][this.subTeacher],
      addedMarks: this.addedMarks,
    };
  }
}
