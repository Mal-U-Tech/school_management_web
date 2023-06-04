import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

interface STUDENT {
  index: string;
  _id: string;
  name: string;
  surname: string;
  score: string;
  percentage: number;
  max_score: string;
  num_students: string;
}

@Component({
  selector: 'app-add-marks',
  templateUrl: './add-marks.component.html',
  styleUrls: ['./add-marks.component.scss'],
})
export class AddMarksComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  bufferValue = 0;

  numStudents = '';
  maxScore = '';
  dataSource: MatTableDataSource<STUDENT> = new MatTableDataSource();
  displayedColumns: string[] = ['index', 'name_surname', 'score', 'percentage'];
  isLoading = false;
  subject_name = '';
  teacher = '';
  pass_mark = '';
  addedMarks: number[] = [];
  data: any;
  className = '';
  maxScoreExceeded = false;

  constructor(
    private scoresheetService: ScoresheetService,
    private marksService: MarksService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.data = JSON.parse(
      sessionStorage.getItem('selected-class-scoresheet') || ''
    );

    this.loadData();
    this.checkClassSubjectMarks();
  }

  // function to send scoresheet marks to db
  saveScoresheetMarks() {
    // assign subject teacher id
    const teacher = this.data.subject_teacher_id;

    // assign subject id
    const subjectId = this.data.subject._id;

    // assign scoresheet id
    const scoresheetId = this.scoresheetService.selectedScoresheetId;

    // assing year
    const year = this.data.year;

    const serverArray: any[] = [];

    // checking if conditions for creating scoresheet are met
    if (this.addedMarks.length < Number.parseInt(this.numStudents)) {
      this.marksService.errorToast(
        `Please add all ${this.numStudents} student marks`
      );
      return;
    } else if (this.addedMarks.length > Number.parseInt(this.numStudents)) {
      this.marksService.errorToast(`Too many added marks`);
    } else if (this.maxScoreExceeded) {
      this.marksService.errorToast('Some marks have exceeded max score!');
    } else {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        const temp = this.dataSource.data[i];
        console.log(temp.score);
        serverArray.push({
          year: year,
          scoresheet_id: scoresheetId,
          subject_id: subjectId,
          subject_teacher_id: teacher,
          mark: temp.score == null ? '' : temp.score.toString(),
          class_student_id: temp._id,
          max_score: Number.parseInt(this.maxScore),
          num_students: this.numStudents,
        });
      }

      this.marksService.postClassMarksArray(serverArray).subscribe({
        next: (data: any) => {
          this.marksService.successToast('Successfully added marks');
          // this.router.navigateByUrl('/select-class');
          this.location.back();
        },
        error: (error) => {
          this.marksService.errorToast(error);
        },
      });
    }
  }

  inputChanged(event: any) {
    const found = this.addedMarks.find(
      (el) => Number.parseInt(event.index) == el
    );

    if (found === undefined || !found) {
      this.addProgressBarValue(event.index);
    } else {
      if (event.score === null) {
        this.decrementProgressBarValue(event.index);
      }
    }

    // calculate correct percentage based on max score
    if (event.score != null || event.score != '' || event.score != undefined) {
      event.percentage = this.calculatePercentage(event.score);
    } else {
      event.percentage = 0;
    }
  }

  addProgressBarValue(index: any) {
    this.addedMarks.push(index);
    this.calculateAddedMarksValue();
  }

  decrementProgressBarValue(index: any) {
    this.addedMarks.forEach((el, idx) => {
      if (el == index) this.addedMarks.splice(idx, 1);
    });
    this.calculateAddedMarksValue();
  }

  // function to lead class subject scoresheet data
  loadData() {
    this.isLoading = true;
    console.log(this.data);

    this.subject_name = this.data.subject.name;
    this.pass_mark = this.data.subject.pass_mark;
    const tempTeacher = this.data.teacher;
    this.teacher = `${this.computeTeacherTitle(
      tempTeacher.gender,
      tempTeacher.marital_status
    )} ${tempTeacher.user_id.name.substring(0, 1)}. ${
      tempTeacher.user_id.surname
    }`;

    this.numStudents = this.data.students.length.toString();
    this.maxScore = '100';
    this.bufferValue = this.data.students.length;
    // console.log(this.bufferValue);
    this.value = 0;
    this.className = this.data.class_id.name;

    // assigning students
    const arr: STUDENT[] = [];

    for (let i = 0; i < this.data.students.length; i++) {
      const tempStudent = this.data.students[i];
      arr.push({
        _id: tempStudent._id,
        name: tempStudent.name,
        surname: tempStudent.surname,
        index: `${i + 1}`,
        score: '',
        percentage: 0,
        max_score: this.maxScore,
        num_students: this.numStudents,
      });
    }

    this.dataSource.data = arr;
    console.log(this.dataSource.data);
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

  // function to check if marks have been added for a class subject scoresheet
  // the function will call the get controller from the controller
  checkClassSubjectMarks() {
    // assign subject teacher id
    const teacher = this.data.subject_teacher_id;

    // assign subject id
    const subjectId = this.data.subject._id;

    // assign scoresheet id
    const scoresheetId = this.scoresheetService.selectedScoresheetId;

    // assing year
    const year = this.data.year;

    // assign class_student_id
    this.marksService
      .getClassScoresheetMarks({
        subject_teacher_id: teacher,
        subject_id: subjectId,
        year: year,
        scoresheet_id: scoresheetId,
        mark: '',
        max_score: 0,
        num_students: 0,
        class_student_id: '',
      })
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.assingStudentsMarks(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  assingStudentsMarks(data: any) {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (this.dataSource.data[i]._id === data[j].class_student_id) {
          this.maxScore = data[j].max_score;
          this.numStudents = data[j].num_students;

          // add score
          this.dataSource.data[i].score = data[j].mark.toString();

          // compute percentage
          this.dataSource.data[i].percentage = this.calculatePercentage(
            this.dataSource.data[i].score
          );

          if (
            this.dataSource.data[i].score === '' ||
            this.dataSource.data[i].score === null
          ) {
            continue;
          } else {
            this.addProgressBarValue(this.dataSource.data[i].index);
          }
        }
      }
    }
  }

  // function to handle num of students changed
  numStudentsChanged() {
    console.log('Num students has been changed');
    this.calculateAddedMarksValue();
  }

  calculateAddedMarksValue() {
    this.value = Math.round(
      (this.addedMarks.length / Number.parseInt(this.numStudents)) * 100
    );
  }

  // function to handle the change of max score
  maxScoreChanged() {
    // go through all the scores that are not null and update the score
    this.dataSource.data.forEach((mark) => {
      if (
        mark.score !== null ||
        mark.score != '' ||
        (mark.score !== undefined && mark.percentage != 0)
      ) {
        console.log(mark.score);
        mark.percentage = this.calculatePercentage(mark.score);
        console.log(mark.percentage);
      }
    });
  }

  calculatePercentage(score: string): number {
    // find a proper rounding off maths function
    console.log(`This is score ${typeof score}`);

    if (score != '') {
      if (Number.parseInt(score) > Number.parseInt(this.maxScore)) {
        console.log(score);
        console.log(this.maxScore.toString());
        this.scoresheetService.errorToast('Mark has exceeded max score!');
        this.maxScoreExceeded = true;
        return 0;
      } else {
        this.maxScoreExceeded = false;

        if (score != null || score != undefined) {
          return Math.round(
            (Number.parseInt(score.toString()) /
              Number.parseInt(this.maxScore.toString())) *
              100
          );
        } else {
          return 0;
        }
      }
    } else {
      return 0;
    }
  }
}
