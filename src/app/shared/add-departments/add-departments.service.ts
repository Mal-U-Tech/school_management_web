import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  IDepartments,
  IDepartmentsArray,
  IDepartmentsGetResponse,
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
  postDepartmentsArray(
    departments: IDepartmentsArray
  ): Observable<IDepartmentsArray> {
    return this.http
      .post<IDepartmentsArray>(
        this.apiUrl + `${this.module}/register-array`,
        departments
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register new department name
  postDepartment(department: IDepartments): Observable<IDepartments> {
    return this.http
      .post<IDepartments>(this.apiUrl + `${this.module}/create`, department)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => view all departments
  viewAllDepartments(
    currentPage: number,
    pageSize: number
  ): Observable<IDepartmentsGetResponse> {
    return this.http
      .get<IDepartmentsGetResponse>(
        this.apiUrl + `${this.module}/view-all/${currentPage}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update department
  updateDepartment(
    id: string,
    department: IDepartments
  ): Observable<IDepartments> {
    return this.http
      .put<IDepartments>(
        this.apiUrl + `${this.module}/update/${id}`,
        department
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete department by id
  deleteDepartment(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
