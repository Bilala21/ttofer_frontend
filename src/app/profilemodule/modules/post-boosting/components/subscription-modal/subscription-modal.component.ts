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
import { RouterLink, RouterLinkActive,Router } from '@angular/router';

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
  // {
  //   basic: {
  //     id:1,
  //     heading: 'Basic',
  //     time: 'Boost 1 days',
  //     price: '2.99',
  //   },
  //   standard: {
  //     id:2,
  //     heading: 'Standard',
  //     time: 'Boost 3 Days',
  //     price: '4.99',
  //   },
  //   bestvalue: {
  //     id:3,
  //     heading: 'Best value',
  //     time: 'Boost Plus',
  //     price: '16.99',
  //   },
  // };
  subscription: any = {};
  subscriptionData: any = {}

  constructor(
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    public router : Router,
    
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("modal",this.data);
    this.subscription = data
    
  }
 
  onNoClick(): void {
    this.router.navigate(['/profile/sale-purchase'], { 
      queryParams: { 
        query: 'selling', 
        subscription_id: this.subscription.id
       } 
    });
    this.dialogRef.close();
  }

  saveChanges(): void {
    //(this.data);
    this.dialogRef.close(this.data);
  }
}
