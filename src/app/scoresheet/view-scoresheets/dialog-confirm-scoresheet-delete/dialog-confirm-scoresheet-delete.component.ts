import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogScoresheetData {
  title: string;
  name: string;
  year: string;
}

@Component({
  selector: 'app-dialog-confirm-scoresheet-delete',
  templateUrl: './dialog-confirm-scoresheet-delete.component.html',
  styleUrls: ['./dialog-confirm-scoresheet-delete.component.scss'],
})
export class DialogConfirmScoresheetDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogScoresheetData
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
