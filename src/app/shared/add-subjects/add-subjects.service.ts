import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import {
  SubjectsArrayInterface,
  SubjectsInterface,
} from './add-subjects.interface';

@Injectable({
  providedIn: 'root',
})
export class AddSubjectsService {
  apiUrl = 'http://localhost:3000/subjects';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error: ${error.error.message}`;
    }

    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => registers subjects for departments in array.
  postSubjects(subjects: any): Observable<SubjectsArrayInterface> {
    return this.http
      .post<SubjectsArrayInterface>(
        this.apiUrl + '/register-array',
        JSON.stringify(subjects),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register one subject for department
  postSubject(subject: any): Observable<SubjectsInterface> {
    return this.http
      .post<SubjectsInterface>(
        this.apiUrl + '/register',
        JSON.stringify(subject),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all subjects
  getAllSubjects(): Observable<SubjectsArrayInterface> {
    return this.http
      .get<SubjectsArrayInterface>(this.apiUrl + '/view-all')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one subject
  getSubject(id: string): Observable<SubjectsInterface> {
    return this.http
      .get<SubjectsInterface>(this.apiUrl + `/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update subject
  updateSubject(id: string, subject: any): Observable<SubjectsInterface> {
    return this.http
      .put<SubjectsInterface>(
        this.apiUrl + `/update/${id}`,
        JSON.stringify(subject),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete subject
  deleteSubject(id: string) {
    return this.http
      .delete(this.apiUrl + `/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
