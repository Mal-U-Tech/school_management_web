import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarksService } from 'src/app/shared/marks/marks.service';

interface ClassScoresheet {
  index: number;
  _id: string;
  name: string;
  surname: string;
  subjects: {
    name: string;
    teacher: {
      title: string;
      name: string;
      surname: string;
    };
  }[];
  marks: string[];
  aggregate: number;
  position: number;
  pass_fail: string;
}

@Component({
  selector: 'app-class-scoresheet',
  templateUrl: './class-scoresheet.component.html',
  styleUrls: ['./class-scoresheet.component.scss'],
})
export class ClassScoresheetComponent {
  // variable definitions
  classname: any;
  schoolName: any;
  scoresheetName: any;
  scoresheetYear: any;
  englishPassMark: number = 0;
  otherSubjectPassMark: number = 0;
  dataSource: MatTableDataSource<ClassScoresheet> = new MatTableDataSource();
  displayedColumns: string[] = ['index', 'studentName'];
  subjects: any[] = [];

  constructor(private marksService: MarksService) {}

  ngOnInit(): void {
    // load data here
    this.loadData();
  }

  // function to load data from sessionStorage
  loadData() {
    let data = JSON.parse(sessionStorage.getItem('scoresheet-data')!);
    let schoolSubjects = JSON.parse(sessionStorage.getItem('subjects')!);
    // console.log(data);
    // console.log(schoolSubjects);

    // assign values to scoresheet interface
    let arr: any[] = [];
    // for each student
    for (let i = 0; i < data.length; i++) {
      // for each subject in the student
      let tempStudent = data[i];

      arr.push({
        index: i + 1,
        _id: tempStudent[0].class_student_id._id,
        name: tempStudent[0].class_student_id.name,
        surname: tempStudent[0].class_student_id.surname,
        marks: [],
        aggregates: 0,
      });

      for (let j = 0; j < tempStudent.length; j++) {
        let tempSubject = tempStudent[j];
        let subjectFound = this.displayedColumns.find(
          (el) => el == tempSubject.subject_teacher_id.subject_id.name
        );

        // console.log(tempStudent.length);
        // console.log(`This is subject found : ${subjectFound}`);
        if (!subjectFound) {
          this.displayedColumns.push(
            tempSubject.subject_teacher_id.subject_id.name
          );

          // assing subjects and subject teacher to subjects array
          this.subjects.push({
            subjectName: tempSubject.subject_teacher_id.subject_id.name,
            teacherTitle: this.computeTeacherTitle(
              tempSubject.subject_teacher_id.teacher_id.gender,
              tempSubject.subject_teacher_id.teacher_id.marital_status
            ),
            teacherName: tempSubject.subject_teacher_id.teacher_id.user_id.name,
            teacherSurname:
              tempSubject.subject_teacher_id.teacher_id.user_id.surname,
          });
          // console.log(this.getSubjectMarks(tempSubject.subject_id, data));
          // arr[i].marks.push(this.getSubjectMarks(tempSubject.subject_id, data));
          // console.log(arr[i]);
        }
      }

      // if (!this.englishPassMark) {
      //
      // }
    }

    // assign to dataSource
    this.dataSource.data = arr;
    this.getStudentSubjectMark(data);
    // this.calculateAggregateforEachStudent();
    this.rankStudent(this.calculateAggregateforEachStudent());
  }

  // function to loop through students and save current subject marks
  getSubjectMarks(subjectId: string, studentsList: []) {
    // let res: string[] = [];
    // let res: string = '';
    studentsList.forEach((student: []) => {
      student.forEach((subject: any) => {
        if (subject.subject_id == subjectId) {
          return subject.mark;
        }
      });
    });

    // return res;
  }

  // function to get a students mark for a subject
  getStudentSubjectMark(data: any[]) {
    let index = 0;
    data.forEach((student: any[]) => {
      let tempStudent = this.dataSource.data[index];
      student.forEach((subject: any) => {
        if (subject.class_student_id._id == tempStudent._id) {
          let percentage = this.calculateMarkPectage(
            subject.mark,
            subject.max_score
          );

          this.dataSource.data[index].marks.push(percentage);
        }
      });
      index++;
    });
  }

  // function to calculate the percentage for each student
  calculateMarkPectage(mark: string, maxScore: string): string {
    return mark === ''
      ? ''
      : Math.round(
          (Number.parseInt(mark) / Number.parseInt(maxScore)) * 100
        ).toString();
  }

  computeTeacherTitle(gender: string, maritalStatus: string): string {
    if (gender === 'Male') {
      return 'Mr.';
    } else if (gender === 'Female' && maritalStatus === 'Single') {
      return 'Ms.';
    } else {
      return 'Mrs.';
    }
  }

  // function to calculate the aggregate for each student
  calculateAggregateforEachStudent() {
    let index = 0;
    this.displayedColumns.push('aggregate');
    let aggregates: number[] = [];

    this.dataSource.data.forEach((student) => {
      // totalMarks
      let numMarks = 0;
      let totalMarks = 0;
      student.marks.forEach((mark) => {
        if (mark != '') {
          totalMarks += Number.parseInt(mark);
          numMarks++;
        }
      });

      let aggregate = totalMarks / numMarks;
      student.aggregate = aggregate;
      aggregates.push(aggregate);
    });
    return aggregates;
  }

  // function to rank students based on aggregate
  rankStudent(array: any[]) {
    let rankingArray = [];

    for (let i = 0; i < array.length; i++) {
      let rank = 1;

      for (let j = 0; j < array.length; j++) {
        if (array[j] > array[i]) rank++;
      }
      rankingArray.push(rank);
    }

    this.displayedColumns.push('position');

    for (let k = 0; k < rankingArray.length; k++) {
      let student = this.dataSource.data[k];
      student.position = rankingArray[k];
    }

    // return rankingArray;
  }
}
