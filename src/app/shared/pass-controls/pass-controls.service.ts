import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { SharedApiConstants } from '../shared.constants';

@Injectable({
  providedIn: 'root',
})
export class PassControlsService extends SharedApiConstants {
  module = 'pass-controls';
  passControls: IPassControls[] = [];

  constructor(private http: HttpClient, snackBar: MatSnackBar) {
    super(snackBar);
  }

  // function to set passControls
  set setPassControls(controls: IPassControls[]) {
    this.passControls = controls;
  }

  // function to append to passControls
  set appendPassControls(control: IPassControls) {
    this.passControls.push(control);
  }

  // function to update passControls
  set updatePassControl(control: IPassControls) {
    for (let i = 0; i < this.passControls.length; i++) {
      if (this.passControls[i]._id === control._id) {
        this.passControls[i] = control;
      }
    }
  }

  // Handle errors
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

  // HttpClient API post() => create new pass controls
  postPassControls(controls: IPassControls): Observable<IPassControls> {
    return this.http
      .post<IPassControls>(
        this.apiUrl + `${this.module}`,
        controls
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get all pass controls
  getAllPassControls(): Observable<IPassControls[]> {
    return this.http
      .get<IPassControls[]>(this.apiUrl + this.module)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get one pass control document
  getOnePassControl(id: string): Observable<IPassControls> {
    return this.http
      .get<IPassControls>(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() => get controls based on scoresheet
  getControlsByScoresheet(id: string): Observable<IPassControls[]> {
    return this.http
      .get<IPassControls[]>(this.apiUrl + `${this.module}/scoresheet/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API patch() => update pass control document
  patchPassControl(
    id: string,
    control: IPassControls
  ): Observable<IPassControls> {
    return this.http
      .patch<IPassControls>(
        this.apiUrl + `${this.module}/${id}`,
        control
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() => delete a pass control document
  deletePassControl(id: string) {
    return this.http
      .delete(this.apiUrl + `${this.module}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
}
