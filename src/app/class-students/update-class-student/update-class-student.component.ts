import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import {
  classStudentsIsLoading,
  updateClassStudentObjectRequest,
} from 'src/app/store/class-students/class-students.actions';

@Component({
  selector: 'app-update-class-student',
  templateUrl: './update-class-student.component.html',
  styleUrls: ['./update-class-student.component.scss'],
})
export class UpdateClassStudentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
  ) {
    const student = data.student;
    this._id = student._id;
    this.name = student.name;
    this.surname = student.surname;
    this.student_contact = student.student_contact;
    this.year = student.year;
    this.genderSelection = student.gender;
    this.classSelection = {
      name: data.stream.name,
      _id: data.stream.class_id,
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

  dispatchClassStudentsIsLoading(state: boolean) {
    this.store.dispatch(
      classStudentsIsLoading({ classStudentsIsLoading: state }),
    );
  }

  // method to update class student in database
  updateClassStudent() {
    // start loading progress indicator.
    this.dispatchClassStudentsIsLoading(true);

    const student: IClassStudent = {
      _id: this._id,
      name: this.name,
      surname: this.surname,
      year: this.year,
      student_contact: this.student_contact,
      gender: this.genderSelection,
      class_id: this.classSelection._id,
    };

    // dispatch action to update class student in effect
    this.store.dispatch(
      updateClassStudentObjectRequest({ id: this._id, classStudent: student }),
    );

    setTimeout(() => {
      this.onLoadDataClicked();
    }, 10000);
    this.onCloseClicked();
    // this.apiService.updateStudent(this._id, student).subscribe({
    //   next: (data: IClassStudent) => {
    //     console.log(data);
    //     setTimeout(() => {
    //       this.onLoadDataClicked();
    //     }, 1000);
    //     this.apiService.successToast('Successfully updated class student');
    //     this.onCloseClicked();
    //   },
    //   error: (error) => {
    //     this.apiService.errorToast(error);
    //     this.onCloseClicked();
    //   },
    // });
  }
}
