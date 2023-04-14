import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogDataClassTeacher {
  title: string;
  name: string;
  surname: string;
  teacher_title: string;
  class: string;
}

@Component({
  selector: 'app-dialog-confirm-class-teacher-delete',
  templateUrl: './dialog-confirm-class-teacher-delete.component.html',
  styleUrls: ['./dialog-confirm-class-teacher-delete.component.scss'],
})
export class DialogConfirmClassTeacherDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataClassTeacher) {}

  onCloseDialog = new EventEmitter();
  onConfirmDelete = new EventEmitter();

  closeDialog() {
    this.onCloseDialog.emit();
  }

  deleteConfirmed() {
    this.onConfirmDelete.emit();
  }
}
