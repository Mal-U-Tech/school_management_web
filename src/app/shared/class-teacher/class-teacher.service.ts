import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IClassTeacher } from './class-teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassTeacherService extends SharedApiConstants {
  module = 'class-teacher';

  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  // error handling
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

  // HttpClient API post() => register new class teacher
  postClassTeacher(teacher: IClassTeacher): Observable<IClassTeacher> {
    return this.http
      .post<IClassTeacher>(
        this.apiUrl + `${this.module}/register`,
        teacher
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all class teachers
  getAllClassTeachers(
    pageNo: number,
    pageSize: number
  ): Observable<IClassTeacher[]> {
    return this.http
      .get<IClassTeacher[]>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get class teachers by year
  getClassTeachersByYear(
    year: string,
    pageNo: number,
    pageSize: number
  ): Observable<IClassTeacher[]> {
    return this.http
      .get<IClassTeacher[]>(
        this.apiUrl + `${this.module}/view-year/${year}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get by class id
  getClassTeacherById(
    class_id: string,
    pageNo: number,
    pageSize: number
  ): Observable<IClassTeacher[]> {
    return this.http
      .get<IClassTeacher[]>(
        this.apiUrl +
          `${this.module}/view-class/${class_id}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update class teacher
  updateClassTeacher(
    id: string,
    teacher: IClassTeacher
  ): Observable<IClassTeacher> {
    return this.http
      .put<IClassTeacher>(
        this.apiUrl + `${this.module}/update/${id}`,
        teacher
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete class teacher
  deleteClassTeacher(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
