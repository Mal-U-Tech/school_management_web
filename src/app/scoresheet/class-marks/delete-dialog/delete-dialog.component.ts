import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarksService } from 'src/app/shared/marks/marks.service';

interface dialogData {
  title: string;
  studentName: string;
  studentSurname: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    public marksService: MarksService
  ) {}

  onClose = new EventEmitter();
  onConfirm = new EventEmitter();

  closeDialog() {
    this.onClose.emit();
  }

  deleteConfirmed() {
    this.onConfirm.emit();
  }
}
