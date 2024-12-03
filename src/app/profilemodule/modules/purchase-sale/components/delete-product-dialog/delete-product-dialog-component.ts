import { Component, Optional, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-product-dialog-component',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
  templateUrl: './delete-product-dialog-component.html',
  styleUrls: ['./delete-product-dialog-component.scss'],
})
export class DeleteProductDialogComponent {
  productId: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public id: any,
  ) {
    
    this.productId=id
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ConfirmChanges(): void { 
    this.dialogRef.close(this.productId);
  }
}
