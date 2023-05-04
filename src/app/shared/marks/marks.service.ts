import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { MarksInterface } from './marks.interface';

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
  postClassMark(mark: any): Observable<MarksInterface> {
    return this.http
      .post<MarksInterface>(
        this.apiUrl + `${this.module}/add`,
        JSON.stringify(mark),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => add marks array to database
  postClassMarksArray(marks: any): Observable<MarksInterface[]> {
    return this.http
      .post<MarksInterface[]>(
        this.apiUrl + `${this.module}/add-array`,
        JSON.stringify(marks),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get marks for specific class, year, subject and scoresheet
  getClassScoresheetMarks(mark: any): Observable<MarksInterface[]> {
    return this.http
      .get<MarksInterface[]>(
        this.apiUrl +
          `${this.module}/view/${mark.year}/${mark.teacherId}/${mark.subjectId}/${mark.scoresheetId}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update mark in database
  updateMark(id: string, body: any): Observable<MarksInterface> {
    return this.http
      .put<MarksInterface>(
        this.apiUrl + `${this.module}/${id}`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClienet API delete() => delete mark from db
  deleteMark(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get scoresheet marks for selected classroom
  getFullScoresheet(classId: string, scoresheetId: string) {
    return this.http
      .get(this.apiUrl + `${this.module}/scoresheet/${classId}/${scoresheetId}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
