import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { HODInterface } from './hod.interface';

@Injectable({
  providedIn: 'root',
})
export class HodService extends SharedApiConstants {
  module = 'head-of-department';
  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  // Error handling
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

  // HttpClient API post() => register HOD
  postHOD(teacher: any): Observable<HODInterface> {
    return this.http
      .post<HODInterface>(
        this.apiUrl + `${this.module}/register`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all HOD's
  getAllHODs(pageNo: number, pageSize: number): Observable<HODInterface[]> {
    return this.http
      .get<HODInterface[]>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one HOD
  getOneHOD(id: string): Observable<HODInterface> {
    return this.http
      .get<HODInterface>(this.apiUrl + `${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update HOD
  updateHOD(id: string, teacher: any): Observable<HODInterface> {
    return this.http
      .put<HODInterface>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete HOD
  deleteHOD(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
