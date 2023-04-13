import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogSubjectTeacherData {
  title: string;
  teacher_title: string;
  name: string;
  surname: string;
  class: string;
  subject: string;
}

@Component({
  selector: 'app-dialog-confirm-sub-teacher-delete',
  templateUrl: './dialog-confirm-sub-teacher-delete.component.html',
  styleUrls: ['./dialog-confirm-sub-teacher-delete.component.scss'],
})
export class DialogConfirmSubTeacherDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogSubjectTeacherData
  ) {}

  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog() {
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
