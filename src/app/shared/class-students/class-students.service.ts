import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { ClassStudentInterface } from './class-students.interface';

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
  postStudent(student: any): Observable<ClassStudentInterface> {
    return this.http
      .post<ClassStudentInterface>(
        this.apiUrl + `${this.module}/register`,
        JSON.stringify(student),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all students
  getAllLearners(
    pageNo: number,
    pageSize: number
  ): Observable<ClassStudentInterface[]> {
    return this.http
      .get<ClassStudentInterface[]>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all students by year
  getAllLearnersByYear(
    year: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassStudentInterface[]> {
    return this.http
      .get<ClassStudentInterface[]>(
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
  ): Observable<ClassStudentInterface[]> {
    return this.http
      .get<ClassStudentInterface[]>(
        this.apiUrl +
          `${this.module}/view-class-year/${classId}/${year}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update student
  updateStudent(id: string, student: any): Observable<ClassStudentInterface> {
    return this.http
      .put<ClassStudentInterface>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(student),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete => delete student
  deleteStudent(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
