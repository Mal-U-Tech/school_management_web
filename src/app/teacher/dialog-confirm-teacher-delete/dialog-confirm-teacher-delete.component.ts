import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogTeacherData {
  title: string;
  name: string;
  surname: string;
  teacher_title: string;
}

@Component({
  selector: 'app-dialog-confirm-teacher-delete',
  templateUrl: './dialog-confirm-teacher-delete.component.html',
  styleUrls: ['./dialog-confirm-teacher-delete.component.scss'],
})
export class DialogConfirmTeacherDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogTeacherData) {}

  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog() {
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
