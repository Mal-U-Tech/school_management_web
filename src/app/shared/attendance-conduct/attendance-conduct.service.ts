import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  IAttendanceConduct,
  IAttendanceConductPostResponse,
} from './attendance-conduct.interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceConductService extends SharedApiConstants {
  module = 'attendance';
  selectedClass = {
    id: '',
    name: '',
  };
  selectedReport = {
    id: '',
    name: '',
    year: '',
  };

  constructor(
    private http: HttpClient,
    snackBar: MatSnackBar,
  ) {
    super(snackBar);
  }

  // error handling
  handleError(error: any): Observable<never> {
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

  // HttpClient API post() => creates new attendance records
  postAttendance(
    attendance: IAttendanceConduct[],
  ): Observable<IAttendanceConductPostResponse> {
    return this.http
      .post<IAttendanceConductPostResponse>(
        this.apiUrl + `${this.module}`,
        attendance,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  //  HttpClient API get() => gets all attendance records
  getAllAttendanceRecords(): Observable<IAttendanceConduct[]> {
    return this.http
      .get<IAttendanceConduct[]>(this.apiUrl + `${this.module}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => getOneAttendance record
  getOneAttendanceRecord(id: string): Observable<IAttendanceConduct> {
    return this.http
      .get<IAttendanceConduct>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => getAttendanceByReport
  getAttendanceByReport(id: string): Observable<IAttendanceConduct[]> {
    return this.http
      .get<IAttendanceConduct[]>(this.apiUrl + `${this.module}/report/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => getAttendance by report and class
  getAttendanceReportClass(
    report: string,
    stream: string,
  ): Observable<IAttendanceConduct[]> {
    return this.http
      .get<IAttendanceConduct[]>(
        this.apiUrl + `${this.module}/class-report/${report}/${stream}`,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API patch() => updated attendance instances
  patchAttendanceRecords(
    id: string,
    attendance: IAttendanceConduct[],
  ): Observable<IAttendanceConduct[]> {
    return this.http
      .patch<IAttendanceConduct[]>(
        this.apiUrl + `${this.module}/${id}`,
        attendance,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete attendace record
  deleteAttendaceRecord(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
