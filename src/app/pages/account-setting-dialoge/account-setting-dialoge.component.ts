import { Component, Optional, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-setting-dialoge',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
  templateUrl: './account-setting-dialoge.component.html',
  styleUrls: ['./account-setting-dialoge.component.scss'],
})
export class AccountSettingDialogeComponent {
  dialogDataCopy: any;
  userInformation:any;
  constructor(
    public dialogRef: MatDialogRef<AccountSettingDialogeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
    this.dialogDataCopy = { ...data};
    this.userInformation={...data.currentUserProfile}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const updatedData:any = {
      key:this.dialogDataCopy.key
    };

    // Check which key is active and populate updatedData accordingly
    switch (this.dialogDataCopy.key) {
      case 'name':
        updatedData['value'] = this.userInformation.name;
        break;
      case 'phone':
        updatedData['value'] = this.userInformation.phone;
        break;
      case 'email':
        updatedData['value'] = this.userInformation.email;
        break;
        case 'password':
          updatedData['old_password'] = this.userInformation.old_password;
          updatedData['password'] = this.userInformation.password;
          break;
      case 'location':
        updatedData['value'] = this.userInformation.location;
        break;
      default:
        break;
    }

    // Close the dialog and return the relevant data
    this.dialogRef.close(updatedData,);
  }
}
