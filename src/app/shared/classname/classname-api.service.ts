import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  ClassnameArrayInterface,
  ClassnameInterface,
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
  postClassnamesArray(classnames: any): Observable<ClassnameArrayInterface> {
    return this.http
      .post<ClassnameArrayInterface>(
        this.apiUrl + `${this.module}/register-array`,
        JSON.stringify(classnames),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => registers new classname
  postClassname(classname: any): Observable<ClassnameInterface> {
    return this.http
      .post<ClassnameInterface>(
        this.apiUrl + `${this.module}/register`,
        JSON.stringify(classname),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => view all classnames
  viewAllClasses(
    currentPage: number,
    pageSize: number
  ): Observable<ClassnameInterface> {
    return this.http
      .get<ClassnameInterface>(
        this.apiUrl + `${this.module}/view-all/${currentPage}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update classname by id
  updateClassname(id: string, classname: any): Observable<ClassnameInterface> {
    return this.http
      .put<ClassnameInterface>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(classname),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete classname by id
  deleteClassname(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
