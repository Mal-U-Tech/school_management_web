import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';

interface IClassMarks {
  index: string;
  student: {
    name: string;
    surname: string;
  };
  teacher: {
    title: string;
    name: string;
    surname: string;
  };
  score: string;
  percentage: string;
}

@Component({
  selector: 'app-class-marks',
  templateUrl: './class-marks.component.html',
  styleUrls: ['./class-marks.component.scss'],
})
export class ClassMarksComponent {
  public className = '';
  public students = [];
  public displayedColumns: string[] = [
    'index',
    'student',
    'teacher',
    'score',
    'percentage',
    'actions',
  ];
  public dataSource: any = [];
  public labels: any[] = [];
  public finalArray: any;
  public selectedClass: any;

  constructor(
    public marksService: MarksService,
    public subTeacher: SubjectTeacherService
  ) {
    this.loadData();
  }

  // function to load data for the marks view
  loadData() {
    this.finalArray = JSON.parse(sessionStorage.getItem('class-marks') || '');
    this.selectedClass = this.marksService.selectedClass;

    console.log(this.selectedClass);
    // const studentData: any[] = [];

    // console.log(finalArray);
    for (let i = 0; i < this.finalArray.length; i++) {
      console.log(this.finalArray.length);
      const subject = this.finalArray[i];

      const subName = Object.keys(subject)[0];
      // this.labels.push(subName);
      // console.log(subject[subName].length);
      // studentData[i] = [];
      const studentData = [];

      for (let j = 0; j < subject[subName].length; j++) {
        // assign students data
        const stud: IClassMarks = {
          index: `${j + 1}`,
          student: {
            name: subject[subName][j].class_student_id.name,
            surname: subject[subName][j].class_student_id.surname,
          },
          teacher: {
            title: this.subTeacher.computeTeacherTitle(
              subject[subName][j].subject_teacher_id.gender,
              subject[subName][j].subject_teacher_id.marital_status
            ),
            name: subject[subName][j].subject_teacher_id.teacher_id.user_id
              .name,
            surname:
              subject[subName][j].subject_teacher_id.teacher_id.user_id.surname,
          },
          score: subject[subName][j].mark,
          percentage: this.calculatePercentage(
            subject[subName][j].mark,
            subject[subName][j].max_score
          ).toString(),
        };

        // console.log(stud.percentage);
        // add data to datasource multi array
        studentData.push(stud);
        // console.log(studentData);
      }

      this.dataSource.push({
        label: subName,
        data: (new MatTableDataSource<IClassMarks>().data = studentData),
      });
    }

    // console.log(this.dataSource);
  }

  calculatePercentage(mark: string, max_score: number) {
    // console.log(mark);
    // console.log(max_score);
    if (mark != '') {
      return Math.round((Number.parseInt(mark) / max_score) * 100);
    } else {
      return 0;
    }
  }

  // function to update student mark
  updateStudentMark(element: any) {
    console.log(element);
  }

  // function to delete student mark
  deleteStudentMark(element: any) {
    console.log(element);
  }
}
