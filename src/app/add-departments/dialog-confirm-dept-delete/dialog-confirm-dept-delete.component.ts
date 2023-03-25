import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogDepartmentData {
  title: string;
  dept: string;
}

@Component({
  selector: 'app-dialog-confirm-dept-delete',
  templateUrl: './dialog-confirm-dept-delete.component.html',
  styleUrls: ['./dialog-confirm-dept-delete.component.scss'],
})
export class DialogConfirmDeptDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogDepartmentData
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
