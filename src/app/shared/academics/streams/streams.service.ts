import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { StreamsInterface } from './streams.interface';

@Injectable({
  providedIn: 'root',
})
export class StreamsService {
  apiUrl: string = 'http://localhost:2000/classname';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

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
      .post<StreamsInterface>(
        this.apiUrl + '/register',
        JSON.stringify(stream),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() => creates new class names
  postStreams();
}
