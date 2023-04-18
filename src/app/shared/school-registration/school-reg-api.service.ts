import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { SchoolRegInterface } from './school-reg.interface';

@Injectable({
  providedIn: 'root',
})
export class SchoolRegApiService extends SharedApiConstants {
  module = 'school-info';

  // CRUD methods to consume RESTful API

  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  // HTTPClient API post() method => create School Info record
  postSchoolInfo(school: any): Observable<SchoolRegInterface> {
    return this.http
      .post<SchoolRegInterface>(
        this.apiUrl + `${this.module}/create`,
        JSON.stringify(school),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API get() method => get school info
  getSchoolInfo(id: any): Observable<SchoolRegInterface> {
    return this.http
      .get<SchoolRegInterface>(
        this.apiUrl + `${this.module}/view-profile/${id}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API update() method => update school info
  updateSchoolInfo(id: string, school: any): Observable<SchoolRegInterface> {
    return this.http
      .put<SchoolRegInterface>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(school),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API delete() method => Delete School info
  deleteSchoolInfo(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // Get client side error
      errorMessage = error.error.message;
    } else {
      // Get server side error
      errorMessage = error.error.message;
    }

    // window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
