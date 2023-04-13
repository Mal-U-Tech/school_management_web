import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import { SubjectTeacherComponent } from '../subject-teacher.component';

interface SUBJECT_TEACHER {
  _id: string;
  index: string;
  subject_id: object;
  teacher_id: object;
  class_id: object;
  title: string;
}

@Component({
  selector: 'app-view-sub-teacher-table',
  templateUrl: './view-sub-teacher-table.component.html',
  styleUrls: ['./view-sub-teacher-table.component.scss'],
})
export class ViewSubTeacherTableComponent {
  isLoading = false;
  totalRows = 0;
  pageSize = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = [
    'index',
    'teacher',
    'subject',
    'class',
    'actions',
  ];
  dataSource: MatTableDataSource<SUBJECT_TEACHER> = new MatTableDataSource();
  dialogRef: any;

  constructor(private api: SubjectTeacherService, public dialog: MatDialog) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.getAllSubjectTeachers(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);

        let arr: SUBJECT_TEACHER[] = [];

        for (let i = 0; i < data.data.length; i++) {
          const temp = data.data[i];
          arr.push({
            _id: temp._id,
            subject_id: temp.subject_id,
            teacher_id: temp.subject_id,
            class_id: temp.class_id,
            index: `${i + 1}`,
            title: this.computeTeacherTitle(
              temp.teacher_id.gender,
              temp.teacher_id.marital_status
            ),
          });
        }

        this.dataSource.data = arr;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.count;
        }, 1000);
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error.toString());
        this.isLoading = false;
      },
    });
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
        console.log();
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
    let instance = this.dialogRef.componentInstance;

    instance.onClose(() => {
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
  }

  openDeleteSubjectTeacherDialog(teacher: any) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfigl.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm subject teacher deletion',
      name: teacher.teacher_id.name,
      surname: teacher.teacher_id.surname,
      teacher_title: teacher.title,
      class: teacher.class_id.name,
      subject: teacher.subject_id.name,
    };

    const dialog = this.dialog.open(
      DialogConfirmSubjectTeacherDeleteComponent,
      dialogConfig
    );

    let instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(teacher);
      dialog.close();
    });
  }
}
