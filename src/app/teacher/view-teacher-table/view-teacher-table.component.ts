import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TeacherService } from 'src/app/shared/teacher/teacher.service';
import { DialogConfirmTeacherDeleteComponent } from '../dialog-confirm-teacher-delete/dialog-confirm-teacher-delete.component';
import { TeacherComponent } from '../teacher.component';

interface TEACHER {
  _id: string;
  index: string;
  title: string;
  user_id: {
    _id: string;
    name: string;
    surname: string;
    contact: string;
  };
  gender: string;
  marital_status: string;
}

@Component({
  selector: 'app-view-teacher-table',
  templateUrl: './view-teacher-table.component.html',
  styleUrls: ['./view-teacher-table.component.scss'],
})
export class ViewTeacherTableComponent {
  ELEMENT_DATA: TEACHER[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = [
    'index',
    'name',
    'surname',
    'contact',
    'actions',
  ];
  dataSource: MatTableDataSource<TEACHER> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;

  constructor(private api: TeacherService, public dialog: MatDialog) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.getAllTeachers(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);

        let arr: TEACHER[] = [];

        for (let i = 0; i < data.data.length; i++) {
          arr.push({
            _id: data.data[i]._id,
            title: this.computeTeacherTitle(
              data.data[i].gender,
              data.data[i].marital_status
            ),
            index: `${i + 1}`,
            user_id: data.data[i].user_id,
            gender: data.data[i].gender,
            marital_status: data.data[i].marital_status,
          });
        }
        this.dataSource.data = arr;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.count;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.dataSource.data = [];
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
    this.api.deleteTeacher(data._id).subscribe({
      next: (res: any) => {
        console.log(res);
        setTimeout(() => {
          this.loadData();
        }, 1000);
      },
      error: (err) => {
        console.log(err);
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
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '45%';

    this.dialogRef = this.dialog.open(TeacherComponent, dialogConfig);
    let instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveTeacher();
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  openUpdateTeacherDialog(teacher: any) {
    console.log(teacher);
  }

  openDeleteTeacherDialog(teacher: any) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm teacher deletion',
      name: teacher.name,
      surname: teacher.surname,
      teacher_title: teacher.title,
    };

    const dialog = this.dialog.open(
      DialogConfirmTeacherDeleteComponent,
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
