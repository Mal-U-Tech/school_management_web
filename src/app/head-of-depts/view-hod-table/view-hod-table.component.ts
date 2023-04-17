import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HodService } from 'src/app/shared/hod/hod.service';
import { DialogConfirmHODDeleteComponent } from '../dialog-confirm-hod-delete/dialog-confirm-hod-delete.component';
import { HeadOfDeptsComponent } from '../head-of-depts.component';

interface HOD {
  _id: string;
  index: string;
  teacher: object;
  department: object;
  title: string;
  year: string;
}

@Component({
  selector: 'app-view-hod-table',
  templateUrl: './view-hod-table.component.html',
  styleUrls: ['./view-hod-table.component.scss'],
})
export class ViewHodTableComponent {
  ELEMENT_DATA: HOD[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayColumns: string[] = [
    'index',
    'teacher',
    'department',
    'year',
    'actions',
  ];
  dataSource: MatTableDataSource<HOD> = new MatTableDataSource();
  dialogRef: any;

  constructor(private api: HodService, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.getAllHODs(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data.data);

        let arr: HOD[] = [];

        for (let i = 0; i < data.data.length; i++) {
          const temp = data.data[i];

          arr.push({
            _id: temp._id,
            teacher: temp.teacher_id,
            department: temp.department_id,
            index: `${i + 1}`,
            title: this.computeTeacherTitle(
              temp.teacher_id.gender,
              temp.teacher_id.marital_status
            ),
            year: temp.year,
          });

          console.log(arr);
        }

        this.dataSource.data = arr;

        setTimeout(() => {
          this.paginator.pageIndex = data.pageNo;
          this.paginator.length = data.count;
        });
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
    this.api.deleteHOD(data._id).subscribe({
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

    this.dialogRef = this.dialog.open(HeadOfDeptsComponent, dialogConfig);
    let instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveHOD();
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  openUpdateHODDialog(teacher: any) {
    console.log(teacher);
  }

  openDeleteHODDialog(teacher: any) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm HOD deletion',
      name: teacher.teacher.name,
      surname: teacher.teacher.surname,
      teacher_title: teacher.title,
      department: teacher.department.name,
    };

    const dialog = this.dialog.open(
      DialogConfirmHODDeleteComponent,
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
