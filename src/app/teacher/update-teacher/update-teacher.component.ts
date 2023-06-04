import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherService } from 'src/app/shared/teacher/teacher.service';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';

@Component({
  selector: 'app-update-teacher',
  templateUrl: './update-teacher.component.html',
  styleUrls: ['./update-teacher.component.scss'],
})
export class UpdateTeacherComponent {
  constructor(
    public apiService: TeacherService,
    @Inject(MAT_DIALOG_DATA) public data: ITeacher
  ) {
    const teacher = data;

    this._id = teacher._id;
    this.user_id = teacher.user_id._id;
    this.name = teacher.user_id.name;
    this.surname = teacher.user_id.surname;
    this.contact = teacher.user_id.contact;
    this.genderSelection = teacher.gender;
    console.log(teacher.marital_status);
    this.marital_status = teacher.marital_status;
  }

  public _id = '';
  public user_id = '';
  public name = '';
  public surname = '';
  public contact = '';
  public genderSelection = 'Select Gender';
  public marital_status = 'Select marital status';
  title = 'Update Teacher';

  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  onLoadData = new EventEmitter();

  onCloseClicked() {
    this.onClose.emit();
  }

  onSubmitClicked() {
    this.onSubmit.emit();
  }

  onLoadDataClicked() {
    this.onLoadData.emit();
  }

  selectGender(gender: string) {
    this.genderSelection = gender;
  }

  selectMaritalStatus(status: string) {
    this.marital_status = status;
  }

  updateTeacher() {
    const teacher: ITeacher = {
      _id: this._id,
      user_id: this.user_id,
      gender: this.genderSelection,
      marital_status: this.marital_status,
    };

    this.apiService.updateTeacher(this._id, teacher).subscribe({
      next: (data: ITeacher) => {
        console.log(data);
        this.apiService.successToast('Successfully updated teacher.');
        this.onLoadDataClicked();
        this.onCloseClicked();
      },
      error: (error) => {
        this.apiService.errorToast(error);
        this.onCloseClicked();
      },
    });
  }
}
