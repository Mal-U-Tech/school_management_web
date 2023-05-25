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
import { ClassnameApiService } from 'src/app/shared/classname/classname-api.service';
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
export class ViewStreamsTableComponent implements OnInit ,AfterViewInit {
  ELEMENT_DATA: STREAM[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];

  displayedColumns: string[] = ['index', 'name', 'actions'];
  dataSource: MatTableDataSource<STREAM> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;

  constructor(private api: ClassnameApiService, public dialog: MatDialog) {}

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

    this.api.viewAllClasses(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);
        const arr: STREAM[] = [];

        for (let i = 0; i < data.data.length; i++) {
          arr.push({
            index: `${i + 1}`,
            _id: data.data[i]._id,
            name: data.data[i].name,
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
        this.isLoading = false;
        this.dataSource.data = [];
      },
    });
  }

  deleteRow(data: any) {
    console.log(data);
    this.api.deleteClassname(data._id).subscribe({
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
        setTimeout(() => {
          this.loadData();
        }, 100);
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
    let instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(stream);
      dialog.close();
    });
  }
}
