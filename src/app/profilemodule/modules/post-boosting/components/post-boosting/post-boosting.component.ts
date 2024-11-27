import { Component } from '@angular/core';
import { BoostingModalComponent } from '../boosting-modal/boosting-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { SubscriptionModalComponent } from '../subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-post-boosting',
  standalone: true,
  imports: [NgIf],
  templateUrl: './post-boosting.component.html',
  styleUrl: './post-boosting.component.scss',
})
export class PostBoostingComponent {
  showNextStep: boolean = false;
  constructor(public dialog: MatDialog) {}
  openDialog(): void {
    const dialogRef = this.dialog.open(BoostingModalComponent, {
      width: '470px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  openSubscriptionDialog(type: string): void {
    console.log(type)
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '470px',
      data: { type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  handleNextStep() {
    this.showNextStep = !this.showNextStep;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}
