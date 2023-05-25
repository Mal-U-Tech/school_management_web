import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../../shared.constants';
import { StreamsInterface } from './streams.interface';

@Injectable({
  providedIn: 'root',
})
export class StreamsService extends SharedApiConstants {
  module = 'api/classname';
  constructor(private http: HttpClient, snackbar: MatSnackBar) {
    super(snackbar);
  }

  // error handling
  handleError(error: any): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // client side error
      errorMessage = error.error.message;
    } else {
      // server side error
      errorMessage = error.error.message;
    }

    return throwError(() => {
      return errorMessage;
    });
  }

  // HttpClient API post() => creates new class name
  postStream(stream: any): Observable<StreamsInterface> {
    return this.http
      .post<StreamsInterface>(this.apiUrl + `${this.module}/register`, stream)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => creates new class names
  // postStreams();
}
