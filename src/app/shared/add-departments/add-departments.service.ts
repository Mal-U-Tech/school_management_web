import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  AddDepartments,
  AddDepartmentsArray,
} from './add-departments.interface';

@Injectable({
  providedIn: 'root',
})
export class AddDepartmentsService extends SharedApiConstants {
  module = 'departments';
  constructor(private http: HttpClient, snackbar: MatSnackBar) {
    super(snackbar);
  }

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client side error
      errorMessage = error.error.message;
    } else {
      // Server side error
      errorMessage = `${error.error.message}`;
    }

    // window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => registers new department names array
  postDepartmentsArray(departments: any): Observable<AddDepartmentsArray> {
    return this.http
      .post<AddDepartmentsArray>(
        this.apiUrl + `${this.module}/register-array`,
        JSON.stringify(departments),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register new department name
  postDepartment(department: any): Observable<AddDepartments> {
    return this.http
      .post<AddDepartments>(
        this.apiUrl + `${this.module}/create`,
        JSON.stringify(department),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => view all departments
  viewAllDepartments(
    currentPage: number,
    pageSize: number
  ): Observable<AddDepartments> {
    return this.http
      .get<AddDepartments>(
        this.apiUrl + `${this.module}/view-all/${currentPage}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update department
  updateDepartment(id: string, department: any): Observable<AddDepartments> {
    return this.http
      .put<AddDepartments>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(department),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete department by id
  deleteDepartment(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
