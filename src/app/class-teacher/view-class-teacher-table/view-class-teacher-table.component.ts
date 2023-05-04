import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClassTeacherService } from 'src/app/shared/class-teacher/class-teacher.service';
import { ClassTeacherComponent } from '../class-teacher.component';
import { DialogConfirmClassTeacherDeleteComponent } from '../dialog-confirm-class-teacher-delete/dialog-confirm-class-teacher-delete.component';

interface CLASS_TEACHER {
  _id: string;
  index: string;
  year: string;
  teacher: object;
  class: object;
  title: string;
}

@Component({
  selector: 'app-view-class-teacher-table',
  templateUrl: './view-class-teacher-table.component.html',
  styleUrls: ['./view-class-teacher-table.component.scss'],
})
export class ViewClassTeacherTableComponent {
  ELEMENT_DATA: CLASS_TEACHER[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = ['index', 'teacher', 'class', 'year', 'actions'];
  dataSource: MatTableDataSource<CLASS_TEACHER> = new MatTableDataSource();
  dialogRef: any;

  constructor(private api: ClassTeacherService, public dialog: MatDialog) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.getAllClassTeachers(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data.data);

        let arr: CLASS_TEACHER[] = [];

        for (let i = 0; i < data.data.length; i++) {
          const temp = data.data[i];

          arr.push({
            _id: temp._id,
            index: `${i + 1}`,
            teacher: {
              name: temp.teacher_id.user_id.name,
              contact: temp.teacher_id.user_id.contact,
              surname: temp.teacher_id.user_id.name,
            },
            class: temp.class_id,
            year: temp.year,
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
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataSource.data = [];
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
    this.api.deleteClassTeacher(data._id).subscribe({
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

    this.dialogRef = this.dialog.open(ClassTeacherComponent, dialogConfig);
    let instance = this.dialogRef.componentInstance;
    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveClassTeacher();
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  openUpdateClassTeacherDialog(teacher: any) {
    console.log(teacher);
  }

  openDeleteClassTeacherDialog(teacher: any) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm class teacher deletion',
      name: teacher.teacher.name,
      surname: teacher.teacher.surname,
      teacher_title: teacher.title,
      class: teacher.class.name,
    };

    const dialog = this.dialog.open(
      DialogConfirmClassTeacherDeleteComponent,
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
