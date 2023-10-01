import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { ClassStudentsComponent } from '../class-students.component';
import { DialogConfirmClassStudentDeleteComponent } from '../dialog-confirm-class-student-delete/dialog-confirm-class-student-delete.component';
import { UpdateClassStudentComponent } from '../update-class-student/update-class-student.component';
import { takeWhile } from 'rxjs';
import {
  classStudentsIsLoading,
  classStudentsPaginatorOptions,
  deleteClassStudentObjectRequest,
} from 'src/app/store/class-students/class-students.actions';
import {
  selectClassStudentArray,
  selectClassStudentIsLoading,
} from 'src/app/store/class-students/class-students.selectors';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';

interface CLASS_STUDENT {
  _id: string;
  index: string;
  name: string;
  class_id: string;
  surname: string;
  student_contact: string;
  year: string;
  gender: string;
}

@Component({
  selector: 'app-view-class-students-table',
  templateUrl: './view-class-students-table.component.html',
  styleUrls: ['./view-class-students-table.component.scss'],
})
export class ViewClassStudentsTableComponent implements OnInit, OnDestroy {
  alive = true;
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayedColumns: string[] = [
    'index',
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
  public streams: any[] = [];
  public labels: any[] = [];
  streams$ = this.store.select(selectStreamsArray);
  classStudents$ = this.store.select(selectClassStudentArray);
  classStudentsLoadingIndicator$ = this.store.select(
    selectClassStudentIsLoading,
  );

  constructor(
    private api: ClassStudentsService,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  dispatchClassStudentsIsLoading(state: boolean) {
    this.store.dispatch(
      classStudentsIsLoading({ classStudentsIsLoading: state }),
    );
  }

  loadData() {
    this.dispatchClassStudentsIsLoading(true);
    this.streams = [];

    this.classStudents$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassStudent[]) => {
        if (data) {
          const classLearnerData: CLASS_STUDENT[][] = [[]];

          for (let i = 0; i < data.length; i++) {
            const temp = data[i];
            // console.log(temp);

            let index = this.labels.findIndex((label) => label === temp.class_id);

            // add class_id to labels array
            if (index === null || index === undefined || index < 0) {
              if (index < 0 && this.labels.length === 0) {
                index = 0;
              } else {
                index = this.labels.length;
                console.log(`Index is ${index}`);
              }

              // add new class to labels array
              this.labels.push(temp.class_id);
            }

            // check if index exists for class student array
            if (
              classLearnerData[index] === null ||
              classLearnerData[index] === undefined
            ) {
              classLearnerData.push([]);
              // console.log(classLearnerData[index]);

              // append current data to correct class learner index
              classLearnerData[index].push({
                _id: temp._id || '',
                index: (classLearnerData[index].length + 1).toString(),
                class_id: this.labels[index],
                name: temp.name,
                surname: temp.surname,
                student_contact: temp.student_contact,
                year: temp.year,
                gender: temp.gender,
              });
            } else {
              classLearnerData[index].push({
                _id: temp._id || '',
                index: (classLearnerData[index].length + 1).toString(),
                class_id: this.labels[index],
                name: temp.name,
                surname: temp.surname,
                student_contact: temp.student_contact,
                year: temp.year,
                gender: temp.gender,
              });
            } // end if else statement
          } // end for loop

          this.streams = [];

          // assign class name to class_id
          this.assignClassName(this.labels);
          console.log(this.labels);

          console.log(classLearnerData);

          for (let i = 0; i < classLearnerData.length; i++) {
            this.streams.push({
              label: this.labels[i],
              data: (new MatTableDataSource<CLASS_STUDENT>().data =
                classLearnerData[i]),
            });
          } // end for loop

          this.dispatchClassStudentsIsLoading(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.streams = [];
      },
    });
  }

  // function to assign class name to class_id
  assignClassName(labels: string[]) {
    let classes: any[] = [];
    const result: any[] = [];
    this.streams$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassname[]) => {
        if (data.length) {
          classes = data;

          // classes data is now assigned
          // loop through labels
          for (let i = 0; i < labels.length; i++) {
            // loop through streams data
            for (let j = 0; j < classes.length; j++) {
              if (labels[i] === classes[j]._id) {
                result.push({
                  class_id: classes[j]._id,
                  name: classes[j].name,
                });
              }
            }
          }
          this.labels = result;
        } else {
          this.labels = [];
        }
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
      }),
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

  // function to assign a stream to the learner
  assignLearnerStream(student: CLASS_STUDENT) {
    let result = {};
    for (let i = 0; i < this.labels.length; i++){
      if(this.labels[i].class_id == student.class_id){
        result = this.labels[i];
      }
    }
    return result;
  }

  openUpdateClassStudentDialog(student: CLASS_STUDENT) {
    // console.log(student);
    // console.log(this.labels);

    // compute learner stream
    const stream = this.assignLearnerStream(student);
    console.log(stream);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      stream: stream,
      streams: this.labels,
      student: student,
    };

    this.dialogRef = this.dialog.open(
      UpdateClassStudentComponent,
      dialogConfig,
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
      console.log('Inside instance onLoadData subscription');
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
      dialogConfig,
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
