import {
  Component,
  Inject,
  Input,
  NO_ERRORS_SCHEMA,
  Optional,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-account-setting-dialoge',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss'],
})
export class SubscriptionModalComponent {
  subscription: any = {};
  subscriptionData: any = {
    basic: {
      heading: 'Basic',
      time: 'Boost 1 days',
      price: 'AED 2.99',
    },
    standard: {
      heading: 'Standard',
      time: 'Boost 3 Days',
      price: 'AED 4.99',
    },
    bestvalue: {
      heading: 'Best value',
      time: 'Boost Plus',
      price: 'AED 16.99',
    },
  };

  constructor(
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data);
    this.subscription = this.subscriptionData[this.data.type];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
