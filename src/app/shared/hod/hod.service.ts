import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IHOD, IHodGetResponse, IHodPost } from './hod.interface';

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
  postHOD(teacher: IHodPost): Observable<IHOD> {
    return this.http
      .post<IHOD>(this.apiUrl + `${this.module}/register`, teacher)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all HOD's
  getAllHODs(pageNo: number, pageSize: number): Observable<IHodGetResponse> {
    return this.http
      .get<IHodGetResponse>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one HOD
  getOneHOD(id: string): Observable<IHOD> {
    return this.http
      .get<IHOD>(this.apiUrl + `${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update HOD
  updateHOD(id: string, teacher: IHodPost): Observable<IHOD> {
    return this.http
      .put<IHOD>(this.apiUrl + `${this.module}/update/${id}`, teacher)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete HOD
  deleteHOD(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
