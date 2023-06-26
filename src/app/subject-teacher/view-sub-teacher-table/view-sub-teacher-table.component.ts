import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
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

interface TAB_GROUP_OBJECT {
  name: string; // classname
  data: {
    index: string;
    _id: string;
    subject_id: object;
    teacher_id: object;
    title: string;
    year: string;
  };
}

@Component({
  selector: 'app-view-sub-teacher-table',
  templateUrl: './view-sub-teacher-table.component.html',
  styleUrls: ['./view-sub-teacher-table.component.scss'],
})
export class ViewSubTeacherTableComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: SUBJECT_TEACHER[] = [];
  isLoading = false;
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

  constructor(private api: SubjectTeacherService, public dialog: MatDialog) {}
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    console.log('Inside after view init');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.getAllSubjectTeachers(0, 0).subscribe({
      next: (data: any) => {
        console.log(data);

        const arr: TAB_GROUP_OBJECT[] = [];
        const labels: string[] = [];
        const teacherData: SUBJECT_TEACHER[][] = [[]];

        for (let i = 0; i < data.length; i++) {
          const temp = data[i];
          // console.log(temp.teacher_id.user_id.name);

          let index = labels.findIndex((label) => label === temp.class_id.name);

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
          //

          // console.log(labels);

          // check if index exits for the teacher data array
          if (teacherData[index] === null || teacherData[index] === undefined) {
            teacherData.push([]);
            console.log(teacherData[index]);
            // append current data to correct teacherData index
            teacherData[index].push({
              _id: temp._id,
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
              _id: temp._id,
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
          }

          // arr.push({
          //   _id: temp._id,
          //   subject_id: temp.subject_id,
          //   teacher_id: {
          //     _id: temp.teacher_id._id,
          //     name: temp.teacher_id.user_id.name,
          //     surname: temp.teacher_id.user_id.surname,
          //     contact: temp.teacher_id.user_id.contact,
          //   },
          //   class_id: temp.class_id,
          //   index: `${i + 1}`,
          //   title: this.api.computeTeacherTitle(
          //     temp.teacher_id.gender,
          //     temp.teacher_id.marital_status
          //   ),
          //   year: temp.year,
          // });
        }

        console.log(labels);
        console.log(teacherData);
         this.streams = [];

        for (let i = 0; i < teacherData.length; i++) {

          this.streams.push({
            label: labels[i],
            data: (new MatTableDataSource<SUBJECT_TEACHER>().data =
              teacherData[i]),
          });
        }
        // this.dataSource.data = arr;

        // setTimeout(() => {
        //   this.paginator.pageIndex = this.currentPage;
        //   this.paginator.length = data.count;
        // });
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error.toString());
        this.streams = [];
        this.isLoading = false;
      },
    });
  }

  deleteRow(data: any) {
    console.log(data);
    this.isLoading = true;
    this.api.deleteSubjectTeachere(data._id).subscribe({
      next: (res: any) => {
        console.log(res);
        setTimeout(() => {
          this.loadData();
        }, 1000);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error.toString());
      },
    });
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
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
      setTimeout(() => {
        this.loadData();
      }, 1000);
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
