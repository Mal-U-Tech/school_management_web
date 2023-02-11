import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddDepartmentsService } from '../shared/add-departments/add-departments.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-departments.component.html',
  styleUrls: ['./add-departments.component.sass'],
})
export class AddDepartmentsComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public apiService: AddDepartmentsService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  public departmentsArray = [{ name: '' }, { name: '' }];

  appendInput() {
    this.departmentsArray.push({ name: '' });
  }

  submitDepartments() {
    // make api call
    this.apiService
      .postDepartmentsArray({ names: this.departmentsArray })
      .subscribe({
        next: (data: any) => {
          this.openSnackBar('Successfully added departments.', 'Close');
          this.router.navigate([`/add-subjects`], {
            queryParams: { departments: JSON.stringify(data.data) },
            queryParamsHandling: 'merge',
          });
        },
        error: (error) => {
          this.openSnackBar(error, 'Close');
        },
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
