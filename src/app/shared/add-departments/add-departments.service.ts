import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import {
  AddDepartments,
  AddDepartmentsArray,
} from './add-departments.interface';

@Injectable({
  providedIn: 'root',
})
export class AddDepartmentsService {
  apiUrl: string = 'http://localhost:3000/departments';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client side error
      errorMessage = error.error.message;
    } else {
      // Server side error
      errorMessage = `Error: ${error.error.message}`;
    }

    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => registers new department names array
  postDepartmentsArray(departments: any): Observable<AddDepartmentsArray> {
    return this.http
      .post<AddDepartmentsArray>(
        this.apiUrl + '/register-array',
        JSON.stringify(departments),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register new department name
  postDepartment(department: any): Observable<AddDepartments> {
    return this.http
      .post<AddDepartments>(
        this.apiUrl + '/create',
        JSON.stringify(department),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => view all departments
  viewAllDepartments(): Observable<AddDepartments> {
    return this.http
      .get<AddDepartments>(this.apiUrl + '/view-all')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update department
  updateDepartment(id: string, department: any): Observable<AddDepartments> {
    return this.http
      .put<AddDepartments>(
        this.apiUrl + '/update/' + id,
        JSON.stringify(department),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete department by id
  deleteDepartment(id: string) {
    return this.http
      .delete(this.apiUrl + '/delete/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
