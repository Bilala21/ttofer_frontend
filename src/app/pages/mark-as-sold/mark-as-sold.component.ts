import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/shared-components/header/header.component';
import { FooterComponent } from '../../shared/shared-components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mark-as-sold',
  templateUrl: './mark-as-sold.component.html',
  styleUrls: ['./mark-as-sold.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NgFor,
    FooterComponent,
    FormsModule,
    NgIf,
    RouterModule,
    NgFor,
    NgxDropzoneModule,
  ]
})
export class MarkAsSoldComponent implements OnInit {
  soldItems:any
  loading = false;
  adList=[{img:'assets/images/action_filled.png',message:'Someone from TTOffer?'},
    {img:'assets/images/action_filled.png',message:'Someone from Outside TTOffer?'},
    {img:'assets/images/action_filled.png',message:'Anthony'},
    {img:'assets/images/action_filled.png',message:'Mark'},
  ];
  isBtnDisabled = true;
  constructor(private mainService:MainServicesService,private router:Router, private toastr:ToastrService,) { }

  ngOnInit() {
    const storedItems = localStorage.getItem('soldItems');
    if (storedItems) {
      this.soldItems = JSON.parse(storedItems);
    }
  }

  onBuyerSelected(buyer: string) {
    console.log('Selected buyer:', buyer);
    // this.isBtnDisabled=false;
    // Handle the buyer selection logic here
  }

  onDoneClick() {
    debugger
    let profileKey: any = localStorage.getItem('key'); 
    profileKey = JSON.parse(profileKey);
      this.mainService.markAsSold(this.soldItems.id).subscribe({
      next: (response: any) => {
        const successMessage = response.message || 'Product is live now!';
        this.toastr.success(successMessage, 'Success');
        localStorage.removeItem('soldItems')
         this.router.navigate([`/profilePage/${profileKey}`], { queryParams: { button: 3 } });
      },
      error: (error) => {
        this.toastr.error('Failed to mark product as sold. Please try again.', 'Error');
        
      }
    });
  }
  
  

  onSkipClick() {
    // Logic for when 'Skip' is clicked
  }
}
