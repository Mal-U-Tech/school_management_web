import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { SharedApiConstants } from '../shared.constants';

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
  postSchoolInfo(school: ISchoolInfo): Observable<ISchoolInfo> {
    console.log(school);
    return this.http
      .post<ISchoolInfo>(
        this.apiUrl + `${this.module}/create`,
        school,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API get() method => get school info
  getSchoolInfo(id: string): Observable<ISchoolInfo> {
    return this.http
      .get<ISchoolInfo>(
        this.apiUrl + `${this.module}/view-profile/${id}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API update() method => update school info
  updateSchoolInfo(id: string, school: ISchoolInfo): Observable<ISchoolInfo> {
    return this.http
      .put<ISchoolInfo>(
        this.apiUrl + `${this.module}/update/${id}`,
        school
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HTTPClient API delete() method => Delete School info
  deleteSchoolInfo(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
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
