import { Component, Optional, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-setting-dialoge',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
  templateUrl: './boosting-modal.component.html',
  styleUrls: ['./boosting-modal.component.scss'],
})
export class BoostingModalComponent {
  constructor(public dialogRef: MatDialogRef<BoostingModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close({ name: 'bilal' });
  }
}
