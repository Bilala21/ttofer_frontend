import { Component,OnInit } from '@angular/core';
import { BoostingModalComponent } from '../boosting-modal/boosting-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgFor, NgIf } from '@angular/common';
import { SubscriptionModalComponent } from '../subscription-modal/subscription-modal.component';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
@Component({
  selector: 'app-post-boosting',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './post-boosting.component.html',
  styleUrl: './post-boosting.component.scss',
})
export class PostBoostingComponent implements OnInit {
  showNextStep: boolean = false;
  data: any = [];
  constructor(public dialog: MatDialog,private mainServices: MainServicesService,) {
   
  }
  getPackages(){
    this.mainServices.getSubscriptionsPlan().subscribe({
      next:(res:any)=>{
        this.data = res.data
        console.log('hello',res.data)
      }
    })
  }
  ngOnInit(){
    this.getPackages()
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(BoostingModalComponent, {
      width: '470px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //(result);
    });
  }
  openSubscriptionDialog(item: string): void {
    const dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '470px',
      data: item ,
    });

    // dialogRef.afterClosed().subscribe((result) => {
      // console.log("result",result)
    // });
  }
  handleNextStep() {
    this.showNextStep = !this.showNextStep;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}
