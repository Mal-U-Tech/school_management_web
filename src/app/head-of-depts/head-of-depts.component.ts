import { Component, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IHOD } from '../shared/hod/hod.interface';
import { HodService } from '../shared/hod/hod.service';

@Component({
  selector: 'app-head-of-depts',
  templateUrl: './head-of-depts.component.html',
  styleUrls: ['./head-of-depts.component.scss'],
})
export class HeadOfDeptsComponent {
  constructor(private apiService: HodService, private _snackBar: MatSnackBar) {}

  // variables for teachers and department
  public teachers: any;
  public departments: any;

  ngOnInit(): void {
    this.teachers = JSON.parse(sessionStorage.getItem('teachers')!);
    this.departments = JSON.parse(sessionStorage.getItem('departments')!);
  }

  // dialog title
  public title = 'Add Head Of Department';
  public res = 0;

  public teacherSelection = {
    _id: '',
    name: 'Select Teacher',
    surname: '',
    title: '',
  };

  public departmentSelection = {
    _id: '',
    name: 'Select Department',
  };
  public year: string = '';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // teacher selection method
  selectTeacher(selection: any) {
    this.teacherSelection = selection;
  }

  // department selection methods
  selectDepartment(selection: any) {
    this.departmentSelection = selection;
  }

  // close head of department dialog
  closeHODDialog() {
    this.onClose.emit();
  }

  // submit head of department to database
  submitHOD() {
    this.onSubmit.emit();
  }

  // api method to save head of department to database
  saveHOD() {
    const teacher: IHOD = {
      teacher_id: this.teacherSelection._id,
      department_id: this.departmentSelection._id,
      year: this.year,
    };

    this.apiService.postHOD(teacher).subscribe({
      next: (data: any) => {
        console.log(data);

        this.closeHODDialog();
        this.openSnackBar(
          `Successfully add the teacher ${
            this.teacherSelection.title
          } ${this.teacherSelection.name.substring(0, 1)}. ${
            this.teacherSelection.surname
          } to be the Head of the ${this.departmentSelection.name} department!`,
          'Close'
        );
        this.res = 1;
      },
      error: (error) => {
        this.closeHODDialog();
        this.openSnackBar(error.toString(), 'Close');
        this.res = 0;
      },
    });
  }

  // show snack bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
