import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';

@Component({
  selector: 'app-update-class-student',
  templateUrl: './update-class-student.component.html',
  styleUrls: ['./update-class-student.component.scss'],
})
export class UpdateClassStudentComponent {
  constructor(
    private apiService: ClassStudentsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const student = data.student;
    this._id = student._id;
    this.name = student.name;
    this.surname = student.surname;
    this.student_contact = student.student_contact;
    this.year = student.year;
    this.genderSelection = student.gender;
    this.classSelection = {
      name: student.class.name,
      _id: student.class._id,
    };
  }

  public dialogTitle = 'Update Class Student';

  // class student variables
  public _id = '';
  public name = '';
  public surname = '';
  public student_contact = '';
  public year = '';
  public genderSelection = 'Select Gender';
  public classSelection = { name: 'Select Grade & Stream', _id: '' };

  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  onLoadData = new EventEmitter();

  // gender selection method
  selectGender(selection: string) {
    this.genderSelection = selection;
  }

  // classname selection method
  selectClassname(selection: any) {
    console.log(`This is the selected classname ${selection.name}`);
    this.classSelection = selection;
  }

  onCloseClicked() {
    this.onClose.emit();
  }

  onSubmitClicked() {
    this.onSubmit.emit();
  }

  onLoadDataClicked() {
    this.onLoadData.emit();
  }

  // method to update class student in database
  updateClassStudent() {
    const student: IClassStudent = {
      _id: this._id,
      name: this.name,
      surname: this.surname,
      year: this.year,
      student_contact: this.student_contact,
      gender: this.genderSelection,
      class_id: this.classSelection._id,
    };

    this.apiService.updateStudent(this._id, student).subscribe({
      next: (data: IClassStudent) => {
        console.log(data);
        setTimeout(() => {
          this.onLoadDataClicked();
        }, 1000);
        this.apiService.successToast('Successfully updated class student');
        this.onCloseClicked();
      },
      error: (error) => {
        this.apiService.errorToast(error);
        this.onCloseClicked();
      },
    });
  }
}
