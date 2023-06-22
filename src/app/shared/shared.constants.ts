import { MatSnackBar } from '@angular/material/snack-bar';

export abstract class SharedApiConstants {
  constructor(private snackBar: MatSnackBar) {}
  apiUrl = 'http://localhost:3000/dev/';
  // apiUrl = 'https://woak4feg7f.execute-api.us-east-1.amazonaws.com/dev/';

  successToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  errorToast(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
