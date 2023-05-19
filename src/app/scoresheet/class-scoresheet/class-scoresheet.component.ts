import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { PassControlsComponent } from 'src/app/pass-controls/pass-controls.component';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { PassControlsService } from 'src/app/shared/pass-controls/pass-controls.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { IScoresheetDatasource } from '../models/scoresheet-datasource.model';
import { IScoresheetSubject } from '../models/scoresheet-subject.model';

@Component({
  selector: 'app-class-scoresheet',
  templateUrl: './class-scoresheet.component.html',
  styleUrls: ['./class-scoresheet.component.scss'],
})
export class ClassScoresheetComponent implements OnInit {
  // variable definitions
  classname = '';
  schoolName = '';
  scoresheetName = '';
  scoresheetYear = '';
  englishPassMark = 0;
  otherSubjectPassMark = 0;
  dataSource: MatTableDataSource<IScoresheetDatasource> =
    new MatTableDataSource();
  displayedColumns: string[] = ['index', 'studentName'];
  subjects: IScoresheetSubject[] = [];
  passControls: IPassControls[] = [];

  constructor(
    private marksService: MarksService,
    private passControlService: PassControlsService,
    private scoresheetService: ScoresheetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // load data here
    this.loadData();
  }

  // function to load data from sessionStorage
  loadData() {
    const data = JSON.parse(sessionStorage.getItem('scoresheet-data') || '');

    // assign values to scoresheet interface
    const arr: IScoresheetDatasource[] = [];

    for (let i = 0; i < data.length; i++) {
      // for each subject in the student
      const tempStudent = data[i];

      arr.push({
        index: i + 1,
        _id: tempStudent[0].class_student_id._id,
        name: tempStudent[0].class_student_id.name,
        surname: tempStudent[0].class_student_id.surname,
        marks: [],
        aggregate: 0,
        position: 0,
        pass_fail: 'something',
      });

      for (let j = 0; j < tempStudent.length; j++) {
        const tempSubject = tempStudent[j];
        const subjectFound = this.displayedColumns.find(
          (el) => el == tempSubject.subject_teacher_id.subject_id.name
        );

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
        }
      }
    }

    // assign to dataSource
    this.dataSource.data = arr;
    this.getStudentSubjectMark(data);
    // this.calculateAggregateforEachStudent();
    this.rankStudent(this.calculateAggregateforEachStudent());

    // add pass pass-controls
    this.passControls = this.passControlService.passControls;

    // load school info
    const schoolInfo: ISchoolInfo = JSON.parse(
      sessionStorage.getItem('school-info') || ''
    );
    console.log(schoolInfo);
    this.classname = this.scoresheetService.className;
    this.schoolName = schoolInfo.name;
    this.scoresheetName = this.scoresheetService.name;
    this.scoresheetYear = this.scoresheetService.selectedYear;

    // compute pass or fail
    this.computePassFail();
  }

  // function to get a students mark for a subject
  getStudentSubjectMark(data: any[]) {
    let index = 0;
    data.forEach((student: any[]) => {
      const tempStudent = this.dataSource.data[index];
      student.forEach((subject: any) => {
        if (subject.class_student_id._id == tempStudent._id) {
          const percentage = this.calculateMarkPectage(
            subject.mark,
            subject.max_score
          );

          this.dataSource.data[index].marks.push(percentage.toString());
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
    this.displayedColumns.push('aggregate');
    const aggregates: number[] = [];

    this.dataSource.data.forEach((student) => {
      // totalMarks
      let numMarks = 0;
      let totalMarks = 0;
      student.marks.forEach((mark) => {
        if (mark.toString() != '') {
          totalMarks += Number.parseInt(mark.toString());
          numMarks++;
        }
      });

      const aggregate = Math.round(totalMarks / numMarks);
      student.aggregate = aggregate;
      aggregates.push(aggregate);
    });
    return aggregates;
  }

  // function to rank students based on aggregate
  rankStudent(array: any[]) {
    const rankingArray = [];

    for (let i = 0; i < array.length; i++) {
      let rank = 1;

      for (let j = 0; j < array.length; j++) {
        if (array[j] > array[i]) rank++;
      }
      rankingArray.push(rank);
    }

    this.displayedColumns.push('position');

    for (let k = 0; k < rankingArray.length; k++) {
      const student = this.dataSource.data[k];
      student.position = rankingArray[k];
    }
  }

  // function to open pass controls dialog
  openPassControls(controls?: IPassControls) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;

    if (controls !== undefined) {
      dialogConfig.data = controls;
    }

    const dialog = this.dialog.open(PassControlsComponent, dialogConfig);
    const instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe((value: IPassControls) => {
      dialog.close();
      for (let i = 0; i < this.passControls.length; i++) {
        if (this.passControls[i]._id === value._id) {
          this.passControls[i] = value;
        }
      }
    });

    instance.onConfirmControls.subscribe(() => {
      instance.submitPassControls();
    });
  }

  // function to compute if a student has passed of failed
  computePassFail() {
    const regex = new RegExp(/\w+.[1-3]\w$/);
    let level = '';

    if (regex.test(this.scoresheetService.className)) {
      level = 'Secondary';
    } else {
      level = 'High School';
    }

    const controls = this.retrievePassingSubjectMark(level);
    for (let i = 0; i < this.dataSource.data.length; i++) {
      const student = this.dataSource.data[i];
      let passSub = false;
      let agg = false;
      let passedSubjects = 0;

      // checking if english is passed
      if (
        Number.parseInt(student.marks[controls.subjectIndex]) >=
        controls.passingMark
      ) {
        passSub = true;
      } else {
        passSub = false;
      }

      // checking aggregate
      if (student.aggregate >= controls.aggregate) {
        agg = true;
      } else {
        agg = false;
      }

      // checking number of passed subject
      student.marks.forEach((mark) => {
        if (mark != '') {
          if (Number.parseInt(mark) >= controls.otherSubjectsPassMark) {
            passedSubjects++;
          }
        }
      });

      // computing result
      const result =
        passSub && agg && passedSubjects >= controls.numPassedSubjects
          ? 'Pass'
          : 'Fail';
      student.pass_fail = result;
    }

    this.displayedColumns.push('pass_fail');
  }

  // function to retrieve passing subject and mark
  retrievePassingSubjectMark(level: string) {
    let passingSubject = '';
    let passingMark = 0;
    let subjectIndex = 0;
    let aggregate = 0;
    let numPassed = 0;
    let othersPassMark = 0;

    this.passControls.forEach((control) => {
      if (control.level === level) {
        passingSubject = control.passing_subject.name;
        passingMark = control.passing_subject.mark;
        aggregate = control.aggregate;
        numPassed = control.num_passed_subject;
        othersPassMark = control.other_subjects_mark;
      }
    });

    // find the index of the passing subject
    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i].subjectName === passingSubject) {
        subjectIndex = i;
      }
    }

    return {
      passingSubject: passingSubject,
      passingMark: passingMark,
      aggregate: aggregate,
      numPassedSubjects: numPassed,
      otherSubjectsPassMark: othersPassMark,
      subjectIndex: subjectIndex,
    };
  }
}
