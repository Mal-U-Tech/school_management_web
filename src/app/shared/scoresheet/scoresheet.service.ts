import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { ScoresheetInterface } from './scoresheet.interface';

@Injectable({
  providedIn: 'root',
})
export class ScoresheetService extends SharedApiConstants {
  // variables for scoresheet creation
  isStepOne = true;
  isStepTwo = false;
  name = '';
  year = '';
  checked: any[] = [];
  subjects: any[] = [];
  selectedClasses: any[] = [];
  selectedScoresheetId: string = '';
  selectedYear: string = '';

  private module = 'scoresheet';
  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

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

  // HttpClient API post() => register scoresheet
  postScoresheet(scoresheet: object): Observable<ScoresheetInterface> {
    console.table(scoresheet);
    return this.http
      .post<ScoresheetInterface>(
        this.apiUrl + `${this.module}`,
        scoresheet,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get scoresheets
  getAllScoresheets(): Observable<ScoresheetInterface[]> {
    return this.http
      .get<ScoresheetInterface[]>(this.apiUrl + `${this.module}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get classnames information using scoresheet
  getStreamsFromScoresheet(id: string): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + `${this.module}/streams/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one scoresheet
  getOneScoresheet(id: string): Observable<ScoresheetInterface> {
    return this.http
      .get<ScoresheetInterface>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API patch => update on scoresheet
  updateScoresheet(
    id: string,
    scoresheet: string
  ): Observable<ScoresheetInterface> {
    return this.http
      .patch<ScoresheetInterface>(
        this.apiUrl + `${this.module}/${id}`,
        scoresheet,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete => delete scoresheet
  deleteScoresheet(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
