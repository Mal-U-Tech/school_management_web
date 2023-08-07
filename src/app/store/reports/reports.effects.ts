import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import { IReports } from 'src/app/shared/reports/reports.interface';
import { ReportsService } from 'src/app/shared/reports/reports.service';
import {
  deleteReportError,
  deleteReportRequest,
  deleteReportSuccess,
  getReportsError,
  getReportsRequest,
  getReportsSuccess,
  postReportError,
  postReportRequest,
  postReportSuccess,
  reportsIsLoading,
  updateReportError,
  updateReportRequest,
  updateReportSuccess,
} from './reports.actions';

@Injectable()
export class ReportEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: ReportsService,
  ) {}

  postReportRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postReportRequest),
      mergeMap(({ report }) =>
        from(this.service.postReport(report)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              reportsIsLoading({ isLoading: false }),
              postReportError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as IReports;
        this.service.successToast('Successfully created reports instance');

        return of(
          reportsIsLoading({ isLoading: false }),
          postReportSuccess({ report: result }),
        );
      }),
    );
  });

  getReportsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getReportsRequest),
      mergeMap(() =>
        from(this.service.getAllReports()).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              reportsIsLoading({ isLoading: false }),
              getReportsError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as IReports[];

        return of(
          reportsIsLoading({ isLoading: false }),
          getReportsSuccess({ reports: result }),
        );
      }),
    );
  });

  updateReportRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateReportRequest),
      mergeMap(({ id, report }) =>
        from(this.service.patchReport(id, report)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              reportsIsLoading({ isLoading: false }),
              updateReportError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);

        this.service.successToast('Successfully updated report instance');

        const result = res as IReports;
        return of(
          reportsIsLoading({ isLoading: false }),
          updateReportSuccess({ report: result }),
        );
      }),
    );
  });

  deleteReportRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteReportRequest),
      mergeMap(({ id }) =>
        from(this.service.deleteReport(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              reportsIsLoading({ isLoading: false }),
              deleteReportError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as { id: string };

        return of(
          reportsIsLoading({ isLoading: false }),
          deleteReportSuccess({ id: result.id }),
        );
      }),
    );
  });
}
