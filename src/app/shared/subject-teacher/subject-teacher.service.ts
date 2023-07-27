import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { ISubjectTeacher } from './subject-teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class SubjectTeacherService extends SharedApiConstants {
  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  module = 'subject-teacher';

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
  postSubjectTeacher(teacher: ISubjectTeacher): Observable<ISubjectTeacher> {
    return this.http
      .post<ISubjectTeacher>(this.apiUrl + `${this.module}/register`, teacher)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Http API get() => get all subject teachers
  getAllSubjectTeachers(
    pageNo: number,
    pageSize: number
  ): Observable<ISubjectTeacher[]> {
    return this.http
      .get<ISubjectTeacher[]>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get on subject teacher
  getOneSubjectTeacher(
    id: string,
    pageNo: string,
    pageSize: string
  ): Observable<ISubjectTeacher> {
    return this.http
      .get<ISubjectTeacher>(
        this.apiUrl + `${this.module}/view-on/${id}/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get teacher if they are correct for the subject
  getTeacherForSubject(
    subject_id: string,
    teacher_id: string,
    class_id: string,
    year: string
  ) {
    console.log(`Subject: ${subject_id}`);
    console.log(`Teacher: ${teacher_id}`);
    console.log(`Class: ${class_id}`);
    console.log(`Year: ${year}`);
    return this.http
      .get(
        this.apiUrl +
          `${this.module}/check-teacher/${subject_id}/${teacher_id}/${class_id}/${year}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() => update subject teacher in db
  updateSubjectTeacher(
    id: string,
    teacher: ISubjectTeacher
  ): Observable<ISubjectTeacher> {
    return this.http
      .put<ISubjectTeacher>(
        this.apiUrl + `${this.module}/update/${id}`,
        teacher
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete subject teacher in db
  deleteSubjectTeacher(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  computeTeacherTitle(gender: string, maritalStatus: string): string {
    if (gender === 'Male') {
      return 'Mr.';
    } else if (gender === 'Female' && maritalStatus === 'Single') {
      return 'Ms.';
    } else {
      return 'Mrs.';
    }
  }
}
