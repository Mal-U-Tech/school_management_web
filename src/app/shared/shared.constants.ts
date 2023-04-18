import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export abstract class SharedApiConstants {
  constructor(private snackBar: MatSnackBar) {}
  apiUrl = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  successToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  errorToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
