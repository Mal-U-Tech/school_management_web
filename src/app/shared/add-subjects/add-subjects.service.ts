import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { ISubjects, ISubjectsArray } from './add-subjects.interface';

@Injectable({
  providedIn: 'root',
})
export class AddSubjectsService extends SharedApiConstants {
  module = 'dept-subject';

  secondarySubjects: ISubjects[] = [];
  highSchoolSubjects: ISubjects[] = [];

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
  postSubjects(subjects: ISubjectsArray): Observable<ISubjectsArray> {
    return this.http
      .post<ISubjectsArray>(
        this.apiUrl + `${this.module}/register-array`,
        subjects
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => register one subject for department
  postSubject(subject: ISubjects): Observable<ISubjects> {
    return this.http
      .post<ISubjects>(
        this.apiUrl + `${this.module}/register`,
        subject
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all subjects
  getAllSubjects(
    pageNo: number,
    pageSize: number
  ): Observable<ISubjectsArray> {
    return this.http
      .get<ISubjectsArray>(
        this.apiUrl + `${this.module}/view-all/${pageNo}/${pageSize}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one subject
  getSubject(id: string): Observable<ISubjects> {
    return this.http
      .get<ISubjects>(this.apiUrl + `${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update() => update subject
  updateSubject(id: string, subject: ISubjects): Observable<ISubjects> {
    return this.http
      .put<ISubjects>(
        this.apiUrl + `${this.module}/update/${id}`,
        subject
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete subject
  deleteSubject(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // function to assign subjects to their different levels;
  assignSubjectsToLevels(data: Array<any>) {
    // remove any subjects currently stored
    this.secondarySubjects = [];
    this.highSchoolSubjects = [];
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      const temp = data[i];
      if (temp.level == 'Secondary') {
        this.secondarySubjects.push({
          _id: temp._id,
          name: temp.name,
          level: temp.level,
          department_id: temp.department_id._id,
          pass_mark: temp.pass_mark,
        });
      } else {
        this.highSchoolSubjects.push({
          _id: temp._id,
          name: temp.name,
          level: temp.level,
          department_id: temp.department_id._id,
          pass_mark: temp.pass_mark,
        });
      }
    }

  }
}
