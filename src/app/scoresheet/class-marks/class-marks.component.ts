import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

interface IClassMarks {
  mark_id: string;
  subject_index: number;
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
    public subTeacher: SubjectTeacherService,
    public dialog: MatDialog
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
        // console.log(subject[subName][j]);

        const stud: IClassMarks = {
          subject_index: i,
          mark_id: subject[subName][j]._id,
          index: `${j + 1}`,
          student: {
            name:
              subject[subName][j].class_student_id == null
                ? ''
                : subject[subName][j].class_student_id.name,
            surname:
              subject[subName][j].class_student_id == null
                ? ''
                : subject[subName][j].class_student_id.surname,
          },
          teacher: {
            title: this.subTeacher.computeTeacherTitle(
              subject[subName][j].subject_teacher_id.teacher_id.gender,
              subject[subName][j].subject_teacher_id.teacher_id.marital_status
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

        // console.log(stud.teacher);
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

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Delete Learner Mark',
      studentName: element.student.name,
      studentSurname: element.student.surname,
    };

    const dialog = this.dialog.open(DeleteDialogComponent, dialogConfig);
    const instance = dialog.componentInstance;

    instance.onClose.subscribe(() => {
      dialog.close();
    });

    instance.onConfirm.subscribe(() => {
      this.deleteMarkAPI(element);
      dialog.close();
    });
  }

  // function to check if value is null and return a empty string
  checkValue(value: any) {
    // console.log(value);
    if (value != null || value != undefined) {
      return value;
    } else {
      return '';
    }
  }

  // function to delete mark from the database
  deleteMarkAPI(mark: IClassMarks) {
    this.marksService.deleteMark(mark.mark_id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSource[mark.subject_index].data.splice(
          [Number.parseInt(mark.index) - 1],
          1
        );

        // update index
        let index = 1;
        this.dataSource[mark.subject_index].data.forEach(
          (stud: IClassMarks) => {
            stud.index = index.toString();
            index++;
          }
        );

        this.dataSource[mark.subject_index].data = [
          ...this.dataSource[mark.subject_index].data,
        ];
      },
      error: (error) => {
        this.marksService.errorToast(error);
      },
    });
  }
}
