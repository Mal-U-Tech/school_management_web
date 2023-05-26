import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IClassStudent } from './class-students.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassStudentsService extends SharedApiConstants {
  module = 'class-student';

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

  // HttpClient API post() => register class student
  postStudent(student: IClassStudent): Observable<IClassStudent> {
    return this.http
      .post<IClassStudent>(
        this.apiUrl + `${this.module}/register`,
        student
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => registr class array
  postStudentArray(students: Array<IClassStudent>): Observable<IClassStudent[]> {
    return this.http
      .post<IClassStudent[]>(
        this.apiUrl + `${this.module}/array`,
        students
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all students
  getAllLearners(
    pageNo: number,
    pageSize: number
  ): Observable<IClassStudent[]> {
    return this.http
      .get<IClassStudent[]>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all students by year
  getAllLearnersByYear(
    year: string,
    pageNo: number,
    pageSize: number
  ): Observable<IClassStudent[]> {
    return this.http
      .get<IClassStudent[]>(
        this.apiUrl + `${this.module}/view-year/${year}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttClient API get() => get all students by class and year
  getAllLearnersByClassYear(
    classId: string,
    year: string,
    pageNo: number,
    pageSize: number
  ): Observable<IClassStudent[]> {
    return this.http
      .get<IClassStudent[]>(
        this.apiUrl +
          `${this.module}/view-class-year/${classId}/${year}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update student
  updateStudent(id: string, student: IClassStudent): Observable<IClassStudent> {
    return this.http
      .put<IClassStudent>(
        this.apiUrl + `${this.module}/update/${id}`,
        student
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete => delete student
  deleteStudent(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
