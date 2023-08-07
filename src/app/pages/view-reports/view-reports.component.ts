import { AfterViewInit, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddReportsDialogComponent } from 'src/app/components/add-reports-dialog/add-reports-dialog.component';
import { AttendanceConductService } from 'src/app/shared/attendance-conduct/attendance-conduct.service';
import { IReports } from 'src/app/shared/reports/reports.interface';
import {
  getReportsRequest,
  postReportRequest,
  reportsIsLoading,
  setChosenReport,
} from 'src/app/store/reports/reports.actions';
import { selectReportsForMatTable } from 'src/app/store/reports/reports.selector';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss'],
})
export class ViewReportsComponent {
  constructor(
    private dialog: MatDialog,
    private store: Store,
    private router: Router,
    public api: AttendanceConductService,
  ) {}

  // ngAfterViewInit(): void {
  //   this.store.dispatch(getReportsRequest());
  // }

  displayedColumns: string[] = ['name', 'actions'];
  reports$ = this.store.select(selectReportsForMatTable);

  updateReportData(report: any) {
    console.log(report);
  }

  deleteReportData(report: any) {
    console.log(report);
  }

  openCreateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;

    const dialogRef = this.dialog.open(AddReportsDialogComponent, dialogConfig);

    const instance = dialogRef.componentInstance;

    instance.onClose.subscribe(() => {
      dialogRef.close();
    });

    instance.onFinish.subscribe((data: IReports) => {
      console.log(data);
      this.saveNewReport(data);
      dialogRef.close();
    });
  }

  dispatchReportsIsLoading(state: boolean) {
    this.store.dispatch(reportsIsLoading({ isLoading: state }));
  }

  saveNewReport(report: IReports) {
    this.dispatchReportsIsLoading(true);

    this.store.dispatch(postReportRequest({ report: report }));
  }

  navigateToGenerateReports(report: any) {
    // set selected report
    console.log(report);
    this.store.dispatch(setChosenReport({chosenReport: report}));
    this.router.navigateByUrl('generate-reports');
  }

  navigateToAttendanceConduct(report: IReports){
    this.api.selectedReport = {
      id: report._id!,
      name: report.name,
      year: report.year
    };

    this.router.navigateByUrl('view-attendance-conduct');
  }

}
