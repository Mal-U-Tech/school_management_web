import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { TeacherInterface } from './teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService extends SharedApiConstants {
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

  // HttpClient API post() => register a teacher
  postTeacher(
    teacher: any,
    schoolInfoId: string
  ): Observable<TeacherInterface> {
    return this.http
      .post<TeacherInterface>(
        this.apiUrl + `teacher/register/${schoolInfoId}`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all teachers
  getAllTeachers(
    pageNo: number,
    pageSize: number
  ): Observable<TeacherInterface[]> {
    return this.http
      .get<TeacherInterface[]>(
        this.apiUrl + `teacher/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update teacher
  updateTeacher(id: string, teacher: any): Observable<TeacherInterface> {
    return this.http
      .put<TeacherInterface>(
        this.apiUrl + `teacher/update/${id}`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete teacher
  deleteTeacher(id: string, schoolInfoId: string, userId: string) {
    return this.http
      .delete(
        this.apiUrl + `teacher/delete/${id}/${schoolInfoId}/${userId}`,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
}
