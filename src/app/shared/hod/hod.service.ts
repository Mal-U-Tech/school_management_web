import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { HODInterface } from './hod.interface';

@Injectable({
  providedIn: 'root',
})
export class HodService {
  apiUrl = 'http://localhost:2000/head-of-department';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

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
        this.apiUrl + `/register`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all HOD's
  getAllHODs(pageNo: number, pageSize: number): Observable<HODInterface[]> {
    return this.http
      .get<HODInterface[]>(this.apiUrl + `/view-all/${pageNo}/${pageSize}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one HOD
  getOneHOD(id: string): Observable<HODInterface> {
    return this.http
      .get<HODInterface>(this.apiUrl + `/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update HOD
  updateHOD(id: string, teacher: any): Observable<HODInterface> {
    return this.http
      .put<HODInterface>(
        this.apiUrl + `/update/:id`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete HOD
  deleteHOD(id: string) {
    return this.http
      .delete(this.apiUrl + `/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
