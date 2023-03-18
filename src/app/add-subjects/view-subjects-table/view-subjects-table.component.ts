import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
import { AddSubjectsComponent } from '../add-subjects.component';
import { DialogConfirmSubjectDeleteComponent } from '../dialog-confirm-subject-delete/dialog-confirm-subject-delete.component';

interface SUBJECT {
  department_id: string;
  department_name: string;
  subject: string;
  level: string;
  _id: string;
  index: string;
}

@Component({
  selector: 'app-view-subjects-table',
  templateUrl: './view-subjects-table.component.html',
  styleUrls: ['./view-subjects-table.component.scss'],
})
export class ViewSubjectsTableComponent {
  ELEMENT_DATA: SUBJECT[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 3, 5, 10, 25, 100];

  displayedColumns: string[] = [
    'index',
    'department',
    'subject',
    'level',
    'actions',
  ];
  dataSource: MatTableDataSource<SUBJECT> = new MatTableDataSource();
  onOpenDialog = new EventEmitter();
  dialogRef: any;

  constructor(private api: AddSubjectsService, public dialog: MatDialog) {}

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

    this.api.getAllSubjects(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);
        let arr: SUBJECT[] = [];

        for (let i = 0; i < data.data.length; i++) {
          arr.push({
            index: `${i + 1}`,
            _id: data.data[i]._id,
            subject: data.data[i].name,
            level: data.data[i].level,
            department_id: data.data[i].department_id._id,
            department_name: data.data[i].department_id.name,
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
      },
    });
  }

  deleteRow(data: any) {
    console.log(data);
    this.api.deleteSubject(data._id).subscribe({
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

    if (component == 'AddSubjectComponent') {
      this.dialogRef = this.dialog.open(AddSubjectsComponent, dialogConfig);
      let instance = this.dialogRef.componentInstance;

      instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      instance.onSubmit.subscribe(() => {
        instance.addSubjects();
        setTimeout(() => {
          this.loadData();
        }, 1000);
      });

      this.dialogRef.afterClosed().subscribe(() => {
        console.log(`Dialog result (View Subjects Table) ${instance.elements}`);
      });
    }
  }

  // TODO: finish up update dialog and API call
  openUpdateDialog(subject: any) {
    console.log(subject);
  }

  openDeleteDialog(subject: any) {
    console.log(subject);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm subject deletion',
      subject: subject.subject,
    };

    const dialog = this.dialog.open(
      DialogConfirmSubjectDeleteComponent,
      dialogConfig
    );
    let instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(subject);
      dialog.close();
    });
  }
}
