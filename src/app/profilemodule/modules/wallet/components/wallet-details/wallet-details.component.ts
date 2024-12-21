import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WalletModalComponent } from '../wallet-modal/wallet-modal.component';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.scss',
})
export class WalletDetailsComponent {
  isValid: boolean = false;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(public dialog: MatDialog) {}
  handleChange(event: any) {
    if (this.emailRegex.test(event.target.value)) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(WalletModalComponent, {
      width: '470px',
      height: '322px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
