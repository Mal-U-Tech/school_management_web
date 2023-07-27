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
import { map, takeWhile, tap } from 'rxjs';
import { ClassnameApiService } from 'src/app/shared/classname/classname-api.service';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import {
  deleteStreamRequest,
  streamsIsLoading,
} from 'src/app/store/streams/streams.actions';
import {
  selectStreamIsLoading,
  selectStreamsArray,
} from 'src/app/store/streams/streams.selector';
import { ClassnameComponent } from '../classname.component';
import { DialogConfirmDeleteComponent } from '../dialog-confirm-delete/dialog-confirm-delete.component';

interface STREAM {
  index: string;
  _id: string;
  name: string;
}

@Component({
  selector: 'app-view-streams-table',
  templateUrl: './view-streams-table.component.html',
  styleUrls: ['./view-streams-table.component.scss'],
})
export class ViewStreamsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  ELEMENT_DATA: STREAM[] = [];

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];

  displayedColumns: string[] = ['index', 'name', 'actions'];
  dataSource: MatTableDataSource<STREAM> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;
  totalPages = 0;
  alive = true;

  // store variables
  streams$ = this.store.select(selectStreamsArray);
  isStreamsLoading$ = this.store.select(selectStreamIsLoading);

  constructor(
    private api: ClassnameApiService,
    public dialog: MatDialog,
    private store: Store
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // load initial data
    this.loadData();
  }

  ngOnDestroy(): void {
      this.alive = false;
  }

  dispatchIsStreamsLoading(state: boolean) {
    this.store.dispatch(streamsIsLoading({ streamsIsLoading: state }));
  }

  loadData() {
    this.dispatchIsStreamsLoading(true);

    this.streams$
      .pipe(takeWhile(() => this.alive))
      .pipe(
        tap((streams: IClassname[]) => {
          this.totalPages = streams.length;
          console.log(this.totalPages);
        }),
        map((streams: IClassname[]) =>
          streams.slice(
            this.currentPage * this.pageSize,
            this.currentPage * this.pageSize + this.pageSize
          )
        ),
        tap((streams: IClassname[]) => {
          console.log(streams);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          const arr: STREAM[] = [];

          for (let i = 0; i < data.length; i++) {
            arr.push({
              index: `${i + 1}`,
              _id: data[i]._id,
              name: data[i].name,
            });
          }
          this.dataSource.data = arr;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.totalPages;
          });
          this.dispatchIsStreamsLoading(false);
        },
        error: (err) => {
          console.log(err);
          this.dispatchIsStreamsLoading(false);
          this.dataSource.data = [];
        },
      });
  }

  deleteRow(data: any) {
    this.store.dispatch(deleteStreamRequest({ id: data._id }));

  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  openDialog(component: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
    // dialogConfig.data = { name: 'Form 4A' };

    if (component == 'ClassnameComponent') {
      this.dialogRef = this.dialog.open(ClassnameComponent, dialogConfig);
      const instance = this.dialogRef.componentInstance;

      instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      instance.onSubmit.subscribe(() => {
        instance.Geeks();
        this.dialogRef.close();
      });

      this.dialogRef.afterClosed().subscribe(() => {
        console.log(`Dialog result: ${instance.classNames}`);
      });
    }
  }

  openDeleteDialog(stream: any) {
    console.log(stream);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm stream deletion',
      stream: stream.name,
    };

    const dialog = this.dialog.open(DialogConfirmDeleteComponent, dialogConfig);
    const instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(stream);
      dialog.close();
    });
  }
}
