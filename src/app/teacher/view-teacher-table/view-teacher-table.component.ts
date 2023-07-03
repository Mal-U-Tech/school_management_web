import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { TeacherService } from 'src/app/shared/teacher/teacher.service';
import { selectSchoolInfoObject } from 'src/app/store/school-info/school-info.selector';
import {
  addTeacherPaginatorOptions,
  deleteTeacherRequest,
  teacherIsLoading,
} from 'src/app/store/teacher/teacher.actions';
import {
  selectPaginatorOptions,
  selectTeacherArray,
  selectTeacherIsLoading,
} from 'src/app/store/teacher/teacher.selector';
import { DialogConfirmTeacherDeleteComponent } from '../dialog-confirm-teacher-delete/dialog-confirm-teacher-delete.component';
import { TeacherComponent } from '../teacher.component';
import { UpdateTeacherComponent } from '../update-teacher/update-teacher.component';

interface TEACHER {
  _id: string;
  index: string;
  title: string;
  user_id: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    contact: string;
  };
  gender: string;
  marital_status: string;
}

@UntilDestroy()
@Component({
  selector: 'app-view-teacher-table',
  templateUrl: './view-teacher-table.component.html',
  styleUrls: ['./view-teacher-table.component.scss'],
})
export class ViewTeacherTableComponent implements OnInit, AfterViewInit {
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
  schoolInfo: any;
  schoolInfo$ = this.store.select(selectSchoolInfoObject);
  teacherIsLoading$ = this.store.select(selectTeacherIsLoading);
  teachers$ = this.store.select(selectTeacherArray);
  paginator$ = this.store.select(selectPaginatorOptions);

  constructor(public dialog: MatDialog, private store: Store) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
    this.schoolInfo$.pipe(untilDestroyed(this)).subscribe({
      next: (data) => {
        if (data) {
          this.schoolInfo = data;
        }
      },
    });
  }

  dispatchTeacherIsLoading() {
    this.store.dispatch(teacherIsLoading({ teacherIsLoading: true }));
  }

  loadData() {
    // this.dispatchTeacherIsLoading();
    this.teachers$.pipe(untilDestroyed(this)).subscribe({
      next: (data: ITeacher[]) => {
        console.log(data);

        const arr: TEACHER[] = [];

        for (let i = 0; i < data.length; i++) {
          arr.push({
            _id: data[i]._id,
            title: this.computeTeacherTitle(
              data[i].gender,
              data[i].marital_status
            ),
            index: `${i + 1}`,
            user_id: data[i].user_id,
            gender: data[i].gender,
            marital_status: data[i].marital_status,
          });
        }
        this.dataSource.data = arr;
      },
    });

    this.paginator$.pipe(untilDestroyed(this)).subscribe({
      next: (data) => {
        this.paginator.pageIndex = data.currentPage;
        this.paginator.length = data.count;
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

    this.dispatchTeacherIsLoading();
    this.store.dispatch(
      deleteTeacherRequest({
        id: data._id,
        schoolInfoId: this.schoolInfo._id,
        userId: data.user_id._id,
      })
    );
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.store.dispatch(
      addTeacherPaginatorOptions({
        paginator: {
          currentPage: event.pageIndex,
          count: 0,
          pageSize: event.pageSize,
        },
      })
    );

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
    const instance = this.dialogRef.componentInstance;

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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = teacher;

    this.dialogRef = this.dialog.open(UpdateTeacherComponent, dialogConfig);
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.updateTeacher();
    });

    instance.onLoadData.subscribe(() => {
      this.loadData();
    });
  }

  openDeleteTeacherDialog(teacher: any) {
    console.log(teacher);
    console.log(this.schoolInfo);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm teacher deletion',
      name: teacher.user_id.name,
      surname: teacher.user_id.surname,
      teacher_title: teacher.title,
    };

    const dialog = this.dialog.open(
      DialogConfirmTeacherDeleteComponent,
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
