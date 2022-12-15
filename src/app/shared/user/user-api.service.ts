import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  apiUrl = 'http://localhost:3000/user';
  // http options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /*========================================
   CRUD Methods for consuming RESTful API
 =========================================*/

  constructor(private http: HttpClient) {}

  // HttpClient API get() method => Fetch users
  getUsers(): Observable<UserInterface> {
    return this.http
      .get<UserInterface>(this.apiUrl + '/view-all')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => login
  userLogin(email: any, password: any): Observable<UserInterface> {
    return this.http
      .post<UserInterface>(
        this.apiUrl + '/login',
        JSON.stringify({ email: email, password: password }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => register
  userRegister(user: any): Observable<UserInterface> {
    console.log(user);
    return this.http
      .post<UserInterface>(
        this.apiUrl + '/create',
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API view-one method => view using id
  viewOne(id: string): Observable<UserInterface> {
    return this.http
      .get<UserInterface>(this.apiUrl + '/view-one/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API update => update user profile
  updateUser(id: string, user: any): Observable<UserInterface> {
    return this.http
      .put<UserInterface>(
        this.apiUrl + '/update/' + id,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http
      .delete(this.apiUrl + '/delete/' + id, this.httpOptions)
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
      errorMessage = `Error: ${error.error.message}`;
    }

    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
