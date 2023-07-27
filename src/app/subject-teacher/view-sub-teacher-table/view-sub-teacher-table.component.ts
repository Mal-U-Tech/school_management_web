import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { delay, of, takeWhile } from 'rxjs';
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import {
  deleteSubjectTeacherRequest,
  subjectTeacherIsLoading,
} from 'src/app/store/subject-teachers/subject-teachers.actions';
import {
  selectSubjectTeacherIsLoading,
  selectSubjectTeachersArray,
} from 'src/app/store/subject-teachers/subject-teachers.selectors';
import { DialogConfirmSubTeacherDeleteComponent } from '../dialog-confirm-sub-teacher-delete/dialog-confirm-sub-teacher-delete.component';
import { SubjectTeacherComponent } from '../subject-teacher.component';
import { UpdateSubjectTeacherComponent } from '../update-subject-teacher/update-subject-teacher.component';

interface SUBJECT_TEACHER {
  _id: string;
  index: string;
  subject_id: object;
  teacher_id: object;
  class_id: object;
  title: string;
  year: string;
}

// interface TAB_GROUP_OBJECT {
//   name: string; // classname
//   data: {
//     index: string;
//     _id: string;
//     subject_id: object;
//     teacher_id: object;
//     title: string;
//     year: string;
//   };
// }

@Component({
  selector: 'app-view-sub-teacher-table',
  templateUrl: './view-sub-teacher-table.component.html',
  styleUrls: ['./view-sub-teacher-table.component.scss'],
})
export class ViewSubTeacherTableComponent implements OnInit, OnDestroy {
  // ELEMENT_DATA: SUBJECT_TEACHER[] = [];
  isLoading = false;
  alive = true;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = [
    'index',
    'teacher',
    'subject',
    'year',
    'actions',
  ];
  // dataSource: MatTableDataSource<SUBJECT_TEACHER> = new MatTableDataSource();
  dialogRef: any;
  public streams: any = [];

  // store variables
  isLoading$ = this.store.select(selectSubjectTeacherIsLoading);
  subjectTeachers$ = this.store.select(selectSubjectTeachersArray);

  constructor(
    private api: SubjectTeacherService,
    public dialog: MatDialog,
    private store: Store
  ) {}

  dispatchSubjectTeacherIsLoading(state: boolean) {
    this.store.dispatch(
      subjectTeacherIsLoading({ subjectTeacherIsLoading: state })
    );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dispatchSubjectTeacherIsLoading(true);
    this.streams = [];

    this.subjectTeachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjectTeacher[]) => {
        if (data) {
          const labels: string[] = [];
          const teacherData: SUBJECT_TEACHER[][] = [[]];

          for (let i = 0; i < data.length; i++) {
            const temp = data[i];
            // console.log(temp.teacher_id.user_id.name);

            let index = labels.findIndex(
              (label) => label === temp.class_id.name
            );

            // add classname to labels array
            if (index === null || index === undefined || index < 0) {
              if (index < 0 && labels.length === 0) {
                index = 0;
              } else {
                index = labels.length;
                console.log(`Index is ${index}`);
              }

              // add new class to labels array
              labels.push(temp.class_id.name);
            }

            // check if index exits for the teacher data array
            if (
              teacherData[index] === null ||
              teacherData[index] === undefined
            ) {
              teacherData.push([]);
              console.log(teacherData[index]);
              // append current data to correct teacherData index
              teacherData[index].push({
                _id: temp._id || '',
                index: (teacherData[index].length + 1).toString(),
                subject_id: temp.subject_id,
                teacher_id: {
                  _id: temp.teacher_id._id,
                  name: temp.teacher_id.user_id.name,
                  surname: temp.teacher_id.user_id.surname,
                  contact: temp.teacher_id.user_id.contact,
                },
                title: this.api.computeTeacherTitle(
                  temp.teacher_id.gender,
                  temp.teacher_id.marital_status
                ),
                class_id: temp.class_id,
                year: temp.year,
              });
            } else {
              // append current data to correct teacherData index
              teacherData[index].push({
                _id: temp._id || '',
                index: (teacherData[index].length + 1).toString(),
                subject_id: temp.subject_id,
                teacher_id: {
                  _id: temp.teacher_id._id,
                  name: temp.teacher_id.user_id.name,
                  surname: temp.teacher_id.user_id.surname,
                  contact: temp.teacher_id.user_id.contact,
                },
                title: this.api.computeTeacherTitle(
                  temp.teacher_id.gender,
                  temp.teacher_id.marital_status
                ),
                class_id: temp.class_id,
                year: temp.year,
              });
            } // end if else statement
          } // end for loop

          this.streams = [];

          for (let i = 0; i < teacherData.length; i++) {
            this.streams.push({
              label: labels[i],
              data: (new MatTableDataSource<SUBJECT_TEACHER>().data =
                teacherData[i]),
            });
          } // end for loop

          this.dispatchSubjectTeacherIsLoading(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.streams = [];
      },
    });
    console.log(`This is after the load data function`);
  }

  deleteRow(data: any) {
    console.log(data);

    this.dispatchSubjectTeacherIsLoading(true);
    this.store.dispatch(deleteSubjectTeacherRequest({ id: data._id }));
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;

    this.dialogRef = this.dialog.open(SubjectTeacherComponent, dialogConfig);
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveSubjectTeacher();
      this.dialogRef.close();

    });
  }

  openUpdateSubjectTeacherDialog(teacher: any) {
    console.log(teacher);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = teacher;

    this.dialogRef = this.dialog.open(
      UpdateSubjectTeacherComponent,
      dialogConfig
    );
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.updateSubjectTeacher();
      this.dialogRef.close();

    });

    instance.onLoadData.subscribe(() => {
      this.loadData();
    });
  }

  openDeleteSubjectTeacherDialog(teacher: any) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm subject teacher deletion',
      name: teacher.teacher_id.name,
      surname: teacher.teacher_id.surname,
      teacher_title: teacher.title,
      class: teacher.class_id.name,
      subject: teacher.subject_id.name,
    };

    const dialog = this.dialog.open(
      DialogConfirmSubTeacherDeleteComponent,
      dialogConfig
    );

    const instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(teacher);
      dialog.close();

    });
  }
}
