import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { ClassStudentsComponent } from '../class-students.component';
import { DialogConfirmClassStudentDeleteComponent } from '../dialog-confirm-class-student-delete/dialog-confirm-class-student-delete.component';
import { UpdateClassStudentComponent } from '../update-class-student/update-class-student.component';
import { delay, map, of, takeWhile, tap } from 'rxjs';
import {
  classStudentsIsLoading,
  classStudentsPaginatorOptions,
  deleteClassStudentObjectRequest,
  getClassStudentsArrayError,
} from 'src/app/store/class-students/class-students.actions';
import {
  selectClassStudentArray,
  selectClassStudentIsLoading,
  selectClassStudentPaginatorOptions,
} from 'src/app/store/class-students/class-students.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';

interface CLASS_STUDENT {
  _id: string;
  class: { _id: string; name: string };
  index: string;
  name: string;
  surname: string;
  student_contact: string;
  year: string;
  gender: string;
}

@UntilDestroy()
@Component({
  selector: 'app-view-class-students-table',
  templateUrl: './view-class-students-table.component.html',
  styleUrls: ['./view-class-students-table.component.scss'],
})
export class ViewClassStudentsTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  alive = true;
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = [
    'index',
    'class',
    'name',
    'surname',
    'student_contact',
    'gender',
    'year',
    'actions',
  ];
  dataSource: MatTableDataSource<CLASS_STUDENT> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;
  streams: IClassname[] = [];
  streams$ = this.store.select(selectStreamsArray);
  classStudents$ = this.store.select(selectClassStudentArray);
  paginator$ = this.store.select(selectClassStudentPaginatorOptions);
  classStudentsLoadingIndicator$ = this.store.select(
    selectClassStudentIsLoading
  );

  constructor(
    private api: ClassStudentsService,
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

  ngOnDestroy(): void {
    this.alive = false;
  }

  dispatchClassStudentsIsLoading(state: boolean) {
    this.store.dispatch(
      classStudentsIsLoading({ classStudentsIsLoading: state })
    );
  }

  loadData() {
    this.dispatchClassStudentsIsLoading(true);

    this.classStudents$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (classStudents: IClassStudent[]) => {
        if (classStudents.length) {
          const arr: CLASS_STUDENT[] = [];

          let stream: any;

          this.streams$.pipe(takeWhile(() => this.alive)).subscribe({
            next: (data) => {
              if (data.length) {
                this.streams = data;
              }
            },
          });

          for (let i = 0; i < classStudents.length; i++) {
            const temp = classStudents[i];

            this.streams.forEach((element: any) => {
              if (element._id == temp.class_id) {
                stream = element.name;
              }
            });

            arr.push({
              _id: temp._id || '',
              class: { _id: temp.class_id, name: stream },
              index: `${i + 1}`,
              name: temp.name,
              surname: temp.surname,
              student_contact: temp.student_contact,
              year: temp.year,
              gender: temp.gender,
            });
          }
          this.dispatchClassStudentsIsLoading(false);
          this.dataSource.data = arr;
        }
      },
      error: (error) => {
        this.dispatchClassStudentsIsLoading(false);
        this.store.dispatch(getClassStudentsArrayError({ message: error }));
      },
    });

    this.paginator$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data) => {
        if (data) {
          this.paginator.pageIndex = data.currentPage;
          this.paginator.length = data.count;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteRow(data: any) {
    console.log(data);
    this.store.dispatch(deleteClassStudentObjectRequest({ id: data._id }));
  }

  pageChanged(event: PageEvent) {
    this.store.dispatch(
      classStudentsPaginatorOptions({
        paginator: {
          currentPage: event.pageIndex,
          pageSize: event.pageSize,
          count: 0,
        },
      })
    );
    this.loadData();
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
    dialogConfig.data = this.streams; // TODO: make this guy work

    this.dialogRef = this.dialog.open(ClassStudentsComponent, dialogConfig);
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveClassStudent();
      this.dialogRef.close();
    });
  }

  openUpdateClassStudentDialog(student: any) {
    console.log(student);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      streams: this.streams,
      student: student,
    };

    this.dialogRef = this.dialog.open(
      UpdateClassStudentComponent,
      dialogConfig
    );
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.updateClassStudent();
      this.dialogRef.close();
    });

    instance.onLoadData.subscribe(() => {
      this.loadData();
    });
  }

  openDeleteClassStudentDialog(student: any) {
    console.log(student);

    let currentStream: any;

    if (this.streams != null) {
      this.streams.forEach((element: any) => {
        console.table(student);
        console.table(element);
        if (element._id == student.class._id) {
          console.log('I am here.');
          currentStream = element.name;
        }
        console.log(currentStream);
      });

      console.log(`After the for loop ${currentStream}`);
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm student deletion',
      name: student.name,
      surname: student.surname,
      stream: currentStream,
      gender: student.gender,
    };

    const dialog = this.dialog.open(
      DialogConfirmClassStudentDeleteComponent,
      dialogConfig
    );

    const instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(student);
      dialog.close();
    });
  }
}
