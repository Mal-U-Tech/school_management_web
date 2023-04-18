import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // HttpClient API get() method => Fetch users
  getUsers(): Observable<UserInterface> {
    return this.http.get<UserInterface>(this.apiUrl + 'user/view-all');
  }

  // HttpClient API post() method => login
  userLogin(email: any, password: any): Observable<UserInterface> {
    return this.http
      .post<UserInterface>(
        this.apiUrl + 'user/login',
        JSON.stringify({ email: email, password: password }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => check modules
  checkModules(adminId: string): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + `check-modules/${adminId}`,
        JSON.stringify({}),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => register
  userRegister(user: any): Observable<UserInterface> {
    console.log(user);
    return this.http
      .post<UserInterface>(
        this.apiUrl + 'user/create',
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API view-one method => view using id
  viewOne(id: string): Observable<UserInterface> {
    return this.http
      .get<UserInterface>(this.apiUrl + 'user/view-one/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update user profile
  updateUser(id: string, user: any): Observable<UserInterface> {
    return this.http
      .put<UserInterface>(
        this.apiUrl + 'user/update/' + id,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http
      .delete(this.apiUrl + 'user/delete/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
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
