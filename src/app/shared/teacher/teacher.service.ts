import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { ITeacher } from './teacher.interface';

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
    teacher: ITeacher,
    schoolInfoId: string
  ): Observable<ITeacher> {
    return this.http
      .post<ITeacher>(
        this.apiUrl + `teacher/register/${schoolInfoId}`,
        teacher
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all teachers
  getAllTeachers(
    pageNo: number,
    pageSize: number
  ): Observable<ITeacher[]> {
    return this.http
      .get<ITeacher[]>(
        this.apiUrl + `teacher/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update teacher
  updateTeacher(id: string, teacher: ITeacher): Observable<ITeacher> {
    return this.http
      .put<ITeacher>(
        this.apiUrl + `teacher/update/${id}`,
        teacher
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete teacher
  deleteTeacher(id: string, schoolInfoId: string, userId: string) {
    return this.http
      .delete(
        this.apiUrl + `teacher/delete/${id}/${schoolInfoId}/${userId}`,
      )
      .pipe(retry(1), catchError(this.handleError));
  }
}
