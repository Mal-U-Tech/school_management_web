import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { TeacherInterface } from './teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  apiUrl = 'http://localhost:2000/teacher';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

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
  postTeacher(teacher: any): Observable<TeacherInterface> {
    return this.http
      .post<TeacherInterface>(
        this.apiUrl + '/register',
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
      .get<TeacherInterface[]>(this.apiUrl + `/view-all/${pageNo}/${pageSize}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update teacher
  updateTeacher(id: string, teacher: any): Observable<TeacherInterface> {
    return this.http
      .put<TeacherInterface>(
        this.apiUrl + `/update/${id}`,
        JSON.stringify(teacher),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete teacher
  deleteTeacher(id: string) {
    return this.http
      .delete(this.apiUrl + `/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
