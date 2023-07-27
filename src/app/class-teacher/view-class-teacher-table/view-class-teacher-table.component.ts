import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { ClassTeacherService } from 'src/app/shared/class-teacher/class-teacher.service';
import {
  classTeacherIsLoading,
  deleteClassTeacherRequest,
} from 'src/app/store/class-teacher/class-teacher.actions';
import { selectClassTeacherIsLoading, selectClassTeachersArray } from 'src/app/store/class-teacher/class-teacher.selector';
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
export class ViewClassTeacherTableComponent implements AfterViewInit, OnInit {
  ELEMENT_DATA: CLASS_TEACHER[] = [];
  totalRows = 0;
  pageSize = 100;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = ['index', 'teacher', 'class', 'year', 'actions'];
  dataSource: MatTableDataSource<CLASS_TEACHER> = new MatTableDataSource();
  dialogRef: any;
  private alive = true;

  // store variables
  classTeachers$ = this.store.select(selectClassTeachersArray);
  isLoading$ = this.store.select(selectClassTeacherIsLoading);

  constructor(
    private api: ClassTeacherService,
    public dialog: MatDialog,
    private store: Store
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  dispatchClassTeacherIsLoading(state: boolean) {
    this.store.dispatch(
      classTeacherIsLoading({ classTeacherIsLoading: state })
    );
  }

  loadData() {
    this.dispatchClassTeacherIsLoading(true);

    this.classTeachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: any) => {
        console.log(data);

        const arr: CLASS_TEACHER[] = [];

        for (let i = 0; i < data.length; i++) {
          const temp = data[i];

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
        }, 1000);

        this.dispatchClassTeacherIsLoading(false);
      },
      error: (error) => {
        this.dispatchClassTeacherIsLoading(false);
        this.dataSource.data = [];
        this.api.errorToast(error);
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

    this.dispatchClassTeacherIsLoading(true);
    this.store.dispatch(deleteClassTeacherRequest({ id: data._id }));
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
    const instance = this.dialogRef.componentInstance;
    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveClassTeacher();
      this.dialogRef.close();
      this.loadData();
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
