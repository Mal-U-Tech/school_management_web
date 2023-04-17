import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DeleteDialogHODData {
  title: string;
  name: string;
  surname: string;
  teacher_title: string;
  department: string;
}

@Component({
  selector: 'app-dialog-confirm-hod-delete',
  templateUrl: './dialog-confirm-hod-delete.component.html',
  styleUrls: ['./dialog-confirm-hod-delete.component.scss'],
})
export class DialogConfirmHODDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogHODData,
  ) {}

  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog(){
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
