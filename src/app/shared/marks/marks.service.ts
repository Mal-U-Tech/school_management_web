import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IMarks } from './marks.interface';

@Injectable({
  providedIn: 'root',
})
export class MarksService extends SharedApiConstants {
  module = 'marks';
  selectedClass: object = { class_id: '', name: '' };

  constructor(private http: HttpClient, _snackBar: MatSnackBar) {
    super(_snackBar);
  }

  // handle errors
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

  // HttpClient API post() => add mark to database
  postClassMark(mark: IMarks): Observable<IMarks> {
    return this.http
      .post<IMarks>(
        this.apiUrl + `${this.module}/add`,
        mark
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => add marks array to database
  postClassMarksArray(marks: Array<IMarks>): Observable<Array<IMarks>> {
    return this.http
      .post<Array<IMarks>>(
        this.apiUrl + `${this.module}/add-array`,
        marks
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get marks for specific class, year, subject and scoresheet
  getClassScoresheetMarks(mark: IMarks): Observable<Array<IMarks>> {
    return this.http
      .get<Array<IMarks>>(
        this.apiUrl +
          `${this.module}/view/${mark.year}/${mark.subject_teacher_id}/${mark.subject_id}/${mark.scoresheet_id}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update mark in database
  updateMark(id: string, mark: IMarks): Observable<IMarks> {
    return this.http
      .put<IMarks>(
        this.apiUrl + `${this.module}/${id}`,
        mark
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClienet API delete() => delete mark from db
  deleteMark(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get scoresheet marks for selected classroom
  getFullScoresheet(classId: string, scoresheetId: string) {
    return this.http
      .get(this.apiUrl + `${this.module}/scoresheet/${classId}/${scoresheetId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
