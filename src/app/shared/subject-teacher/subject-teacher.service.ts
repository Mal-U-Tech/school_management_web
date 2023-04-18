import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { SubjectTeacherInterface } from './subject-teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class SubjectTeacherService extends SharedApiConstants {
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

  // HttpClient API post() => register subject teacher
  postSubjectTeacher(teacher: any): Observable<SubjectTeacherInterface> {
    return this.http
      .post<SubjectTeacherInterface>(
        this.apiUrl + `subject-teacher/register`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // Http API get() => get all subject teachers
  getAllSubjectTeachers(
    pageNo: number,
    pageSize: number
  ): Observable<SubjectTeacherInterface[]> {
    return this.http
      .get<SubjectTeacherInterface[]>(
        this.apiUrl + `subject-teacher/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get on subject teacher
  getOneSubjectTeacher(
    id: string,
    pageNo: string,
    pageSize: string
  ): Observable<SubjectTeacherInterface> {
    return this.http
      .get<SubjectTeacherInterface>(
        this.apiUrl + `subject-teacher/view-on/${id}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update subject teacher in db
  updateSubjectTeacher(
    id: string,
    teacher: any
  ): Observable<SubjectTeacherInterface> {
    return this.http
      .put<SubjectTeacherInterface>(
        this.apiUrl + `subject-teacher/update/${id}`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete subject teacher in db
  deleteSubjectTeachere(id: string) {
    return this.http
      .delete(this.apiUrl + `subject-teacher/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
