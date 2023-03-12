import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import {
  ClassnameArrayInterface,
  ClassnameInterface,
} from './classname.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassnameApiService {
  apiUrl: string = 'http://localhost:2000/classname';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // CRUD methods to consume RESTful API
  constructor(private http: HttpClient) {}

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
        this.apiUrl + '/register-array',
        JSON.stringify(classnames),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => registers new classname
  postClassname(classname: any): Observable<ClassnameInterface> {
    return this.http
      .post<ClassnameInterface>(
        this.apiUrl + '/register',
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
        this.apiUrl + `/view-all/${currentPage}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update classname by id
  updateClassname(id: string, classname: any): Observable<ClassnameInterface> {
    return this.http
      .put<ClassnameInterface>(
        this.apiUrl + '/update/' + id,
        JSON.stringify(classname),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete classname by id
  deleteClassname(id: string) {
    return this.http
      .delete(this.apiUrl + '/delete/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
