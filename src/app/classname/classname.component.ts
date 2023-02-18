import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-classname',
  templateUrl: './classname.component.html',
  styleUrls: ['./classname.component.sass'],
})
export class ClassnameComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public apiService: ClassnameApiService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  public classNames = [{ name: '' }, { name: '' }];

  Geeks() {
    // make api call via service
    this.apiService.postClassnamesArray({ names: this.classNames }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.openSnackBar('Successfully added streams', 'Close');
        this.router.navigate(['/add-departments']);
      },
      error: (error) => {
        this.openSnackBar(error, 'Close');
      },
    });
    console.log(this.classNames);
  }

  jumpToDashboard() {
    this.router.navigate(['/splash']);
  }

  appendInput() {
    this.classNames.push({ name: '' });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
