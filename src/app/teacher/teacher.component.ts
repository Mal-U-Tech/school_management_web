import { Component, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from '../shared/teacher/teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
})
export class TeacherComponent {
  constructor(
    private apiService: TeacherService,
    private _snackBar: MatSnackBar
  ) {}

  // dialog title
  public title = 'Add Teacher';
  public res = 0;

  // teacher schema properties
  public name: string = '';
  public surname: string = '';
  public contact: string = '';
  public genderSelection = 'Select gender';
  public maritalStatusSelection = 'Select marital status';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // gender selection method
  selectGender(selection: string) {
    this.genderSelection = selection;
  }

  // marital status selection method
  selectMaritalStatus(selection: string) {
    this.maritalStatusSelection = selection;
  }

  // close teacher dialog event
  closeTeacherDialog() {
    this.onClose.emit();
  }

  // submit teacher to database event
  submitTeacherRequest() {
    this.onSubmit.emit();
  }

  // method to submit teacher to database via api
  saveTeacher() {
    let teacher = {
      name: this.name,
      surname: this.surname,
      contact: this.contact,
      gender: this.genderSelection,
      marital_status: this.maritalStatusSelection,
    };
    this.apiService.postTeacher(teacher).subscribe({
      next: (data: any) => {
        console.log(data);
        this.closeTeacherDialog();
        this.openSnackBar('Successfully saved teacher', 'Close');
        this.res = 1;
      },
      error: (err) => {
        this.closeTeacherDialog();
        this.openSnackBar(err, 'Close');
        this.res = 0;
      },
    });
  }

  // show snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
