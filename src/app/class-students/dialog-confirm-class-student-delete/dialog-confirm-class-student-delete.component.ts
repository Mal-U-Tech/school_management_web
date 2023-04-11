import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogClassStudentData {
  title: string;
  name: string;
  surname: string;
  gender: string;
  stream: string;
}

@Component({
  selector: 'app-dialog-confirm-class-student-delete',
  templateUrl: './dialog-confirm-class-student-delete.component.html',
  styleUrls: ['./dialog-confirm-class-student-delete.component.scss'],
})
export class DialogConfirmClassStudentDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogClassStudentData
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
