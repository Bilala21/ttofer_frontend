import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { Extension } from '../../helper/common/extension/extension';

@Component({
  selector: 'app-mark-as-sold',
  templateUrl: './mark-as-sold.component.html',
  styleUrls: ['./mark-as-sold.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxDropzoneModule,
  ]
})
export class MarkAsSoldComponent implements OnInit {
  soldItems:any
  loading = false;
  sellingChat:any;
  currentUserId:any;
  buyer_id:any;
  adList=[{img:'assets/images/action_filled.png',message:'Someone from TTOffer?'},
    {img:'assets/images/action_filled.png',message:'Someone from Outside TTOffer?'},
    {img:'assets/images/action_filled.png',message:'Anthony'},
    {img:'assets/images/action_filled.png',message:'Mark'},
  ];
  isBtnDisabled = true;
  constructor(private mainService:MainServicesService,private router:Router, private toastr:ToastrService, private extension: Extension,) { }

  ngOnInit() {
    this.currentUserId = this.extension.getUserId();

    const storedItems = localStorage.getItem('soldItems');
    if (storedItems) {
      this.soldItems = JSON.parse(storedItems);
    }
    this.getAllChatsOfUser()
  }
  getAllChatsOfUser = () => {
    this.mainService
      .getAllChatsOfUser(this.currentUserId)
      .subscribe((res: any) => {
        this.sellingChat = res.data.seller_chats;
        this.sellingChat=this.sellingChat.filter((chat: any) => chat.product_id === this.soldItems.id);
      });
  };
  onBuyerSelected(buyer: any) {
    this.isBtnDisabled=false;
    debugger
    this.buyer_id=buyer.buyer_id
  }

  onDoneClick() {
    // 
    let profileKey: any = localStorage.getItem('key'); 
    profileKey = JSON.parse(profileKey);
    const soldItem = {
      product_id: this.soldItems.id,
      buyer_id: this.buyer_id,
    }
      this.mainService.markAsSold(soldItem).subscribe({
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
