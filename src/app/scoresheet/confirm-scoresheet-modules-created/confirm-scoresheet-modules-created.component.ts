import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-scoresheet-modules-created',
  templateUrl: './confirm-scoresheet-modules-created.component.html',
  styleUrls: ['./confirm-scoresheet-modules-created.component.scss'],
})
export class ConfirmScoresheetModulesCreatedComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmScoresheetModulesCreatedComponent>
  ) {}

  ngOnInit() {}

  closeConfirmationDialog() {
    this.dialogRef.close();
  }

  confirmScoresheetCreation(): string {
    return 'create-scoresheet-steps';
  }
}
