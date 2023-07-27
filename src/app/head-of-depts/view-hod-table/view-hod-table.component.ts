import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { IHOD } from 'src/app/shared/hod/hod.interface';
import { HodService } from 'src/app/shared/hod/hod.service';
import { deleteHodRequest, hodIsLoading } from 'src/app/store/hod/hod.actions';
import {
  selectHodIsLoading,
  selectHodsArray,
} from 'src/app/store/hod/hod.selectors';
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
export class ViewHodTableComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: HOD[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  displayColumns: string[] = [
    // 'index',
    'teacher',
    'department',
    'year',
    'actions',
  ];
  dataSource: MatTableDataSource<IHOD> = new MatTableDataSource<IHOD>();
  hodsObservableDatasource$: Observable<MatTableDataSource<IHOD>> = null as any;
  dialogRef: any;
  hods$ = this.store.select(selectHodsArray);
  isLoading$ = this.store.select(selectHodIsLoading);

  constructor(public dialog: MatDialog, private store: Store) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  dispatchHodIsLoading(state: boolean) {
    this.store.dispatch(hodIsLoading({ hodIsLoading: state }));
  }

  loadData() {
    this.dispatchHodIsLoading(true);
    this.hods$.subscribe({
      next: (items: IHOD[]) => {
        this.dataSource.data = items;
        this.dispatchHodIsLoading(false);
      },
    });

    console.log(this.dataSource.data);


  }

  deleteRow(data: any) {
    console.log(data);

    this.dispatchHodIsLoading(true);
    this.store.dispatch(deleteHodRequest({ id: data._id }));
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
    const instance = this.dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    instance.onSubmit.subscribe(() => {
      instance.saveHOD();
      this.dialogRef.close();
    });
  }

  openUpdateHODDialog(teacher: any) {
    console.log(teacher);
  }

  openDeleteHODDialog(teacher: IHOD) {
    console.log(teacher);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm HOD deletion',
      name: teacher.teacher_id.user_id.name,
      surname: teacher.teacher_id.user_id.surname,
      teacher_title: teacher.teacher_id.title,
      department: teacher.department_id.name,
    };

    const dialog = this.dialog.open(
      DialogConfirmHODDeleteComponent,
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
