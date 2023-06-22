import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from './user.interface';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends SharedApiConstants {
  /*========================================
   CRUD Methods for consuming RESTful API
 =========================================*/

  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  module = 'api/user';

  // HttpClient API get() method => Fetch users
  getUsers(): Observable<IUser> {
    return this.http.get<IUser>(this.apiUrl + `${this.module}/view-all`);
  }

  // HttpClient API post() method => login
  userLogin(email: string, password: string): Observable<IUser> {
    return this.http
      .post<IUser>(this.apiUrl + `${this.module}/login`, {
        email,
        password,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => login
  authLogin(email: string, password: string): Observable<IUser> {
    return this.http
      .post<IUser>(this.apiUrl + `auth/login`, {
        email,
        password,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => check modules
  checkModules(adminId: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + `check-modules/${adminId}`, {})
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => register
  userRegister(user: {
    name: string;
    surname: string;
    contact: string;
    email: string;
    password: string;
  }): Observable<IUser> {
    console.log(user);
    return this.http
      .post<IUser>(this.apiUrl + `${this.module}/create`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API view-one method => view using id
  viewOne(id: string): Observable<IUser> {
    return this.http
      .get<IUser>(this.apiUrl + `${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update user profile
  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http
      .put<IUser>(this.apiUrl + `${this.module}/update/${id}`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/delete/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: { error: Error }) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client side error
      errorMessage = error.error.message;
    } else {
      // Get server side error
      errorMessage = `${error.error.message}`;
    }

    // window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
