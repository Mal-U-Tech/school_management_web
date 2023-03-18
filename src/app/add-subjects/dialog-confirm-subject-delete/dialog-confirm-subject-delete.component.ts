import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogSubjectData {
  title: string;
  subject: string;
}

@Component({
  selector: 'app-dialog-confirm-subject-delete',
  templateUrl: './dialog-confirm-subject-delete.component.html',
  styleUrls: ['./dialog-confirm-subject-delete.component.scss'],
})
export class DialogConfirmSubjectDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogSubjectData) {}

  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog() {
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
