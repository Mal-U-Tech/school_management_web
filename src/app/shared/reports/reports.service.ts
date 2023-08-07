import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IReports, IReportsPostDTO } from './reports.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportsService extends SharedApiConstants {
  module = 'reports';
  constructor(
    private http: HttpClient,
    _snackBar: MatSnackBar,
  ) {
    super(_snackBar);
  }

  // handle errors
  handleErrors(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error.message;
    }

    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => add report instance
  postReport(report: IReports): Observable<IReports> {
    return this.http
      .post<IReports>(this.apiUrl + `${this.module}`, report)
      .pipe(retry(1), catchError(this.handleErrors));
  }

  // HttpClient API get() => get all reports instance
  getAllReports(): Observable<IReports[]> {
    return this.http
      .get<IReports[]>(this.apiUrl + `${this.module}`)
      .pipe(retry(1), catchError(this.handleErrors));
  }

  // HttpClient API get() => get on report instance by id
  getOneReport(id: string): Observable<IReports> {
    return this.http
      .get<IReports>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleErrors));
  }

  // HttpClient API patch => update report instance
  patchReport(id: string, report: IReports): Observable<IReports> {
    return this.http
      .patch<IReports>(this.apiUrl + `${this.module}/${id}`, report)
      .pipe(retry(1), catchError(this.handleErrors));
  }

  // HttpClient API delete => delete report instance
  deleteReport(id: string): Observable<{ id: string }> {
    return this.http
      .delete<{ id: string }>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleErrors));
  }
}
