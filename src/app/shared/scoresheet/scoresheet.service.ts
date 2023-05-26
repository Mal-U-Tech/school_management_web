import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { SharedApiConstants } from '../shared.constants';
import { IScoresheet } from './scoresheet.interface';

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
  selectedScoresheetId = '';
  selectedYear = '';
  className = '';

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
  postScoresheet(scoresheet: IScoresheet): Observable<IScoresheet> {
    console.table(scoresheet);
    return this.http
      .post<IScoresheet>(
        this.apiUrl + `${this.module}`,
        scoresheet
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get scoresheets
  getAllScoresheets(): Observable<Array<IScoresheet>> {
    return this.http
      .get<Array<IScoresheet>>(this.apiUrl + `${this.module}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get classnames information using scoresheet
  getStreamsFromScoresheet(id: string): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + `${this.module}/streams/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one scoresheet
  getOneScoresheet(id: string): Observable<IScoresheet> {
    return this.http
      .get<IScoresheet>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API patch => update on scoresheet
  updateScoresheet(
    id: string,
    scoresheet: IScoresheet,
  ): Observable<IScoresheet> {
    return this.http
      .patch<IScoresheet>(
        this.apiUrl + `${this.module}/${id}`,
        scoresheet,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete => delete scoresheet
  deleteScoresheet(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
