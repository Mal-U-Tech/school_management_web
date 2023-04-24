import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import {
  SubjectsArrayInterface,
  SubjectsInterface,
} from './add-subjects.interface';

@Injectable({
  providedIn: 'root',
})
export class AddSubjectsService extends SharedApiConstants {
  module = 'dept-subject';

  secondarySubjects: any[] = [];
  highSchoolSubjects: any[] = [];

  constructor(private http: HttpClient, snackbar: MatSnackBar) {
    super(snackbar);
  }

  // Error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.error.message}`;
    }

    // window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => registers subjects for departments in array.
  postSubjects(subjects: any): Observable<SubjectsArrayInterface> {
    return this.http
      .post<SubjectsArrayInterface>(
        this.apiUrl + `${this.module}/register-array`,
        JSON.stringify(subjects),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register one subject for department
  postSubject(subject: any): Observable<SubjectsInterface> {
    return this.http
      .post<SubjectsInterface>(
        this.apiUrl + `${this.module}/register`,
        JSON.stringify(subject),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all subjects
  getAllSubjects(
    pageNo: number,
    pageSize: number
  ): Observable<SubjectsArrayInterface> {
    return this.http
      .get<SubjectsArrayInterface>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one subject
  getSubject(id: string): Observable<SubjectsInterface> {
    return this.http
      .get<SubjectsInterface>(this.apiUrl + `${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update subject
  updateSubject(id: string, subject: any): Observable<SubjectsInterface> {
    return this.http
      .put<SubjectsInterface>(
        this.apiUrl + `${this.module}/update/${id}`,
        JSON.stringify(subject),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete subject
  deleteSubject(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // function to assign subjects to their different levels;
  assignSubjectsToLevels(data: any) {
    // remove any subjects currently stored
    this.secondarySubjects = [];
    this.highSchoolSubjects = [];
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      let temp = data[i];
      if (temp.level == 'Secondary') {
        this.secondarySubjects.push({
          _id: temp._id,
          name: temp.name,
          department_id: temp.department_id._id,
        });
      } else {
        this.highSchoolSubjects.push({
          _id: temp._id,
          name: temp.name,
          department_id: temp.department_id._id,
        });
      }
    }

    console.log('Secondary subjects');
    console.log(this.secondarySubjects);
    console.log('High School Subjects');
    console.log(this.highSchoolSubjects);
  }
}
