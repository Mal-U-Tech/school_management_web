import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { UserInterface } from './user.interface';
import { SharedApiConstants } from '../shared.constants';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  getUsers(): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.module}/view-all`);
  }

  // HttpClient API post() method => login
  userLogin(email: string, password: string): Observable<UserInterface> {
    return this.http
      .post<UserInterface>(this.apiUrl + `${this.module}/login`, {
        email,
        password,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => check modules
  checkModules(adminId: string): Observable<any> {
    return this.http
      .post<any>(`/dev/check-modules/${adminId}`, {})
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => register
  userRegister(user: {
    name: string;
    surname: string;
    contact: string; // Get client side error
    email: string;
    password: string;
  }): Observable<UserInterface> {
    console.log(user);
    return this.http
      .post<UserInterface>(`${this.module}/create`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API view-one method => view using id
  viewOne(id: string): Observable<UserInterface> {
    return this.http
      .get<UserInterface>(`${this.module}/view-one/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update user profile
  updateUser(id: string, user: any): Observable<UserInterface> {
    return this.http
      .put<UserInterface>(
        `${this.module}/update/${id}`,
        user,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http
      .delete(`${this.module}/delete/${id}`)
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
