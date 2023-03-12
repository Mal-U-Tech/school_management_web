import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogData {
  title: string;
  stream: string;
}

@Component({
  selector: 'app-dialog-confirm-delete',
  templateUrl: './dialog-confirm-delete.component.html',
  styleUrls: ['./dialog-confirm-delete.component.scss'],
})
export class DialogConfirmDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {}
  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog() {
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
