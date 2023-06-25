import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  IClassname,
  IClassnameArray,
  IClassnamePaginatorResult,
  IClassnamePostResult,
} from './classname.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassnameApiService extends SharedApiConstants {
  module = 'classname';

  // CRUD methods to consume RESTful API
  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.error.message}`;
    }

    // window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => registers new classnames array
  postClassnamesArray(
    classnames: IClassnameArray
  ): Observable<IClassnamePostResult> {
    return this.http
      .post<IClassnamePostResult>(
        this.apiUrl + `${this.module}/register-array`,
        classnames
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => registers new classname
  postClassname(classname: IClassname): Observable<IClassname> {
    return this.http
      .post<IClassname>(this.apiUrl + `${this.module}/register`, classname)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => view all classnames
  viewAllClasses(
    currentPage: number,
    pageSize: number
  ): Observable<IClassnamePaginatorResult> {
    return this.http
      .get<IClassnamePaginatorResult>(
        this.apiUrl + `${this.module}/view-all/${currentPage}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update classname by id
  updateClassname(id: string, classname: IClassname): Observable<IClassname> {
    return this.http
      .put<IClassname>(this.apiUrl + `${this.module}/update/${id}`, classname)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete classname by id
  deleteClassname(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
