import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export abstract class SharedApiConstants {
  constructor(private snackBar: MatSnackBar) {}
  // apiUrl = 'http://localhost:3000/dev/';
  apiUrl = 'https://9655vlh7t0.execute-api.us-east-1.amazonaws.com/dev/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  successToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  errorToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
