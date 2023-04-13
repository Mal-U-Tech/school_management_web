import { Component, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassTeacherService } from '../shared/class-teacher/class-teacher.service';

@Component({
  selector: 'app-class-teacher',
  templateUrl: './class-teacher.component.html',
  styleUrls: ['./class-teacher.component.scss'],
})
export class ClassTeacherComponent {
  constructor(
    private apiService: ClassTeacherService,
    private _snackBar: MatSnackBar
  ) {}

  // variables for teachers and classes
  public classes: any;
  public teachers: any;

  ngOnInit(): void {
    this.classes = JSON.parse(sessionStorage.getItem('streams')!);
    this.teachers = JSON.parse(sessionStorage.getItem('teachers')!);
  }

  // dialog title
  public title = 'Add Class Teacher';
  public res = 0;

  public teacherSelection = {
    _id: '',
    name: 'Select Teacher',
    surname: '',
    title: '',
  };
  public classSelection = {
    _id: '',
    name: 'Select Grade & Stream',
  };
  public year: string = '';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // class selection method
  selectClass(selection: any) {
    this.classSelection = selection;
  }

  // teacher selection method
  selectTeacher(selection: any) {
    this.teacherSelection = selection;
  }

  // close class teacher dialog
  closeClassTeacherDialog() {
    this.onClose.emit();
  }

  // submit class teacher to database
  submitClassTeacher() {
    this.onSubmit.emit();
  }

  // api method to submit teacher to database
  saveClassTeacher() {
    let teacher = {
      teacher_id: this.teacherSelection._id,
      class_id: this.classSelection._id,
      year: this.year,
    };

    this.apiService.postClassTeacher(teacher).subscribe({
      next: (data: any) => {
        console.log(data);

        this.closeClassTeacherDialog();
        this.openSnackBar(
          `Successfully added the class teacher ${
            this.teacherSelection.title
          } ${this.teacherSelection.name.substring(0, 1)}. ${
            this.teacherSelection.surname
          } to the class ${this.classSelection.name}!`,
          'Close'
        );
        this.res = 1;
      },
      error: (error) => {
        this.closeClassTeacherDialog();
        this.openSnackBar(error.toString(), 'Close');
        this.res = 0;
      },
    });
  }

  // show snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
