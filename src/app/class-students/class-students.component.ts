import { Component, EventEmitter, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassStudentsService } from '../shared/class-students/class-students.service';

export interface StreamDialogData {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrls: ['./class-students.component.scss'],
})
export class ClassStudentsComponent {
  constructor(
    private apiService: ClassStudentsService,
    // private apiClassnameService: ClassnameApiService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: StreamDialogData[]
  ) {}

  ngAfterViewInit(): void {}

  // dialog title
  public title = 'Add Student';
  public res = 0;

  // class student schema properties
  public name: string = '';
  public surname: string = '';
  public student_contact: string = '';
  public year: string = '';
  public genderSelection = 'Select Gender';
  public classSelection = { name: 'Select Grade & Stream', _id: '' };

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // gender selection method
  selectGender(selection: string) {
    this.genderSelection = selection;
  }

  // classname selection method
  selectClassname(selection: any) {
    console.log(`This is the selected classname ${selection.name}`);
    this.classSelection = selection;
  }

  // close class student dialog
  closeClassStudentDialog() {
    this.onClose.emit();
  }

  // submit class student to database
  submitClassStudent() {
    this.onSubmit.emit();
  }

  // method to submit class studnet to database via api
  saveClassStudent() {
    let student = {
      name: this.name,
      surname: this.surname,
      student_contact: this.student_contact,
      year: this.year,
      gender: this.genderSelection,
      class_id: this.classSelection._id,
    };

    this.apiService.postStudent(student).subscribe({
      next: (data: any) => {
        console.log(data);
        this.closeClassStudentDialog();
        this.openSnackBar('Successfully added student', 'Close');
        this.res = 1;
      },
      error: (error) => {
        this.closeClassStudentDialog();
        this.openSnackBar(error, 'Close');
        this.res = 0;
      },
    });
  }

  // show snack bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
