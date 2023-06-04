import { Component, EventEmitter, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IClassStudent } from '../shared/class-students/class-students.interface';
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
    @Inject(MAT_DIALOG_DATA) public data: StreamDialogData[]
  ) {}

  // dialog title
  public title = 'Add Student';
  public res = 0;

  // class student schema properties
  public name = '';
  public surname = '';
  public student_contact = '';
  public year = '';
  public genderSelection = 'Select Gender';
  public classSelection = { name: 'Select Grade & Stream', _id: '' };
  public isUpdating = false;
  public selectedClassStudentId = '';

  // variables for adding file from local system
  file?: File;
  arrayBuffer: any;
  filelist: any;
  routerLink = 'add-by-excel';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  onConfirmAddByExcel = new EventEmitter();

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

  addStudentsByExcel() {
    this.onConfirmAddByExcel.emit();
  }

  // method to submit class studnet to database via api
  saveClassStudent() {
    const student = {
      name: this.name,
      surname: this.surname,
      student_contact: this.student_contact,
      year: this.year,
      gender: this.genderSelection,
      class_id: this.classSelection._id,
    };

    this.apiService.postStudent(student).subscribe({
      next: (data: IClassStudent) => {
        console.log(data);
        this.closeClassStudentDialog();
        this.apiService.successToast('Successfully added student');
        this.res = 1;
      },
      error: (error) => {
        this.closeClassStudentDialog();
        this.apiService.errorToast(error);
        this.res = 0;
      },
    });
  }
}
