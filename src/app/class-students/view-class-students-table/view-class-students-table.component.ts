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
import { Store } from '@ngrx/store';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { ClassStudentsComponent } from '../class-students.component';
import { DialogConfirmClassStudentDeleteComponent } from '../dialog-confirm-class-student-delete/dialog-confirm-class-student-delete.component';
import { UpdateClassStudentComponent } from '../update-class-student/update-class-student.component';
import { map } from 'rxjs';

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

@Component({
  selector: 'app-view-class-students-table',
  templateUrl: './view-class-students-table.component.html',
  styleUrls: ['./view-class-students-table.component.scss'],
})
export class ViewClassStudentsTableComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: CLASS_STUDENT[] = [];
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
  streams$ = this.store.select(selectStreamsArray);

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

  loadData() {
    this.isLoading = true;

    this.api.getAllLearners(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);

        const arr: CLASS_STUDENT[] = [];
        let tempArray: any;
        let stream: any;
        // if (sessionStorage.getItem('streams') != null) {
        //   tempArray = JSON.parse(sessionStorage.getItem('streams')!);
        // }
        this.streams$.pipe(map((data) => (tempArray = data)));

        for (let i = 0; i < data.data.length; i++) {
          const temp = data.data[i];

          tempArray.forEach((element: any) => {
            console.log(`This is the index ${element}`);
            // const stream = temp[i];

            if (element._id == temp.class_id) {
              stream = element.name;
            }
            console.log(element.name);
          });

          arr.push({
            _id: temp._id,
            class: { _id: temp.class_id, name: stream },
            index: `${i + 1}`,
            name: temp.name,
            surname: temp.surname,
            student_contact: temp.student_contact,
            year: temp.year,
            gender: temp.gender,
          });
        }
        this.dataSource.data = arr;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.count;
        }, 1000);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.dataSource.data = [];
        this.isLoading = false;
      },
    });
  }

  deleteRow(data: any) {
    console.log(data);
    this.api.deleteStudent(data._id).subscribe({
      next: (res: any) => {
        console.log(res);
        setTimeout(() => {
          this.loadData();
        }, 1000);
      },
      error: (error) => {
        console.log(error);
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
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
    dialogConfig.data = JSON.parse(sessionStorage.getItem('streams') || ''); // TODO: make this guy work

    this.dialogRef = this.dialog.open(ClassStudentsComponent, dialogConfig);
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveClassStudent();
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  openUpdateClassStudentDialog(student: any) {
    console.log(student);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      streams: JSON.parse(sessionStorage.getItem('streams') || ''),
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
    });

    instance.onLoadData.subscribe(() => {
      this.loadData();
    });
  }

  openDeleteClassStudentDialog(student: any) {
    console.log(student);

    // get stream from session storage
    // console.log(sessionStorage.getItem('streams'));
    let temp: any;
    let currentStream: any;

    if (sessionStorage.getItem('streams') != null) {
      console.log(`This is where I'm at`);
      temp = JSON.parse(sessionStorage.getItem('streams')!);
      console.log(`This is temp ${typeof temp[0].name}`);

      temp.forEach((element: any) => {
        console.log(`This is the index ${element}`);
        // const stream = temp[i];

        if (element._id == student.class_id) {
          currentStream = element.name;
        }
        console.log(element.name);
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

    let instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(student);
      dialog.close();
    });
  }
}
