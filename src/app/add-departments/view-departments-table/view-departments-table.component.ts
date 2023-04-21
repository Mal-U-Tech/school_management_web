import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddDepartmentsService } from 'src/app/shared/add-departments/add-departments.service';
import { AddDepartmentsComponent } from '../add-departments.component';
import { DialogConfirmDeptDeleteComponent } from '../dialog-confirm-dept-delete/dialog-confirm-dept-delete.component';

interface DEPARTMENT {
  index: string;
  _id: string;
  department: string;
}

@Component({
  selector: 'app-view-departments-table',
  templateUrl: './view-departments-table.component.html',
  styleUrls: ['./view-departments-table.component.scss'],
})
export class ViewDepartmentsTableComponent {
  ELEMENT_DATA: DEPARTMENT[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];

  displayedColumns: string[] = ['index', 'department', 'actions'];

  dataSource: MatTableDataSource<DEPARTMENT> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;

  constructor(private api: AddDepartmentsService, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // load initial data
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.api.viewAllDepartments(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);
        let arr: DEPARTMENT[] = [];

        for (let i = 0; i < data.data.length; i++) {
          arr.push({
            index: `${i + 1}`,
            department: data.data[i].name,
            _id: data.data[i]._id,
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

  deleteRow(data: any) {
    console.log(data);
    this.api.deleteDepartment(data._id).subscribe({
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
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';

    this.dialogRef = this.dialog.open(AddDepartmentsComponent, dialogConfig);
    let instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.submitDepartments();
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  openUpdateDeptDialog(dept: any) {
    console.log(dept);
  }

  openDeleteDeptDialog(dept: any) {
    console.log(dept);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm department deletion',
      dept: dept.department,
    };

    const dialog = this.dialog.open(
      DialogConfirmDeptDeleteComponent,
      dialogConfig
    );
    let instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(dept);
      dialog.close();
    });
  }
}
