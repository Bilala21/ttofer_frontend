import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-auction-user-profile',
    standalone: true,
    templateUrl: './auction-user-profile.component.html',
    styleUrl: './auction-user-profile.component.scss',
    imports: [NgFor, NgIf, StarRatingComponent,RouterLink]
})
export class AuctionUserProfileComponent {
    activeTab: any = 'products';
    loading = false;
    showOTPBox= false;

    setActiveTab(tab: string) {
        this.activeTab = tab;
      }
    products: any [] =[
       
    ]
    showOtp(){
      this.showOTPBox = true
    }
    reviews: any [] =[
        {img:'assets/images/reviewProfile1.svg', name:'Anthony Stark', starImg:'assets/images/stars.png', detail:'Excellent quality, fast shipping, and great customer service. Highly recommend this product for everyone.'},
        {img:'assets/images/reviewProfile1.svg', name:'Anthony Stark', starImg:'assets/images/stars.png', detail:'Excellent quality, fast shipping, and great customer service. Highly recommend this product for everyone.'},
        {img:'assets/images/reviewProfile1.svg', name:'Anthony Stark', starImg:'assets/images/stars.png', detail:'Excellent quality, fast shipping, and great customer service. Highly recommend this product for everyone.'},
        {img:'assets/images/reviewProfile1.svg', name:'Anthony Stark', starImg:'assets/images/stars.png', detail:'Excellent quality, fast shipping, and great customer service. Highly recommend this product for everyone.'},
    ]

    reportUser: any [] = [
        {id: 'flexRadioDefault1', content1: 'Inappropriate profile picture'},
        {id: 'flexRadioDefault1', content1: 'The User is threatening me'},
        {id: 'flexRadioDefault1', content1: 'The User is Insulting me'},
        {id: 'flexRadioDefault1', content1: 'Spam'},
        {id: 'flexRadioDefault1', content1: 'Fraud'},
        {id: 'flexRadioDefault1', content1: 'Other'},
    ]

    isDropdownOpen = false;
    currentUserid:number = 0;
    auctionUserList:any={}
    reviewsUserList:any;
    auctionUserId:any;

    constructor(
      private route: ActivatedRoute,
      private mainServices: MainServicesService,
      private extension: Extension,
      private snackBar: MatSnackBar,
    ){
      this.currentUserid = extension.getUserId()
    }
    ngOnInit():void{
      this.auctionUserId = this.route.snapshot.paramMap.get('id')!;
      this.getAuctionUser()
      // this.getSelling()
      // this.getAllChatsOfUser()
    }
    showSuccessMessage(message:string) {
      this.snackBar.open(message, '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }
    getAuctionUser(){
      // this.loading = true
// 
      this.mainServices.getUserInfo(this.auctionUserId).subscribe((res:any) =>{
        
        this.auctionUserList = res.data
        this.reviewsUserList = res.data.products
        //('auction Produtc', this.auctionUserList);
        this.loading = false
      })

    }
    openVerifyEmailModal() {
      const modal = document.getElementById('verifyEmailModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.setAttribute('aria-modal', 'true');
        modal.removeAttribute('aria-hidden');
        document.body.classList.add('modal-open');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }

    closeVerifyEmailModal() {
      const modal = document.getElementById('verifyEmailModal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          document.body.removeChild(backdrop);
        }
      }
    }

    openVerifyPhoneModal() {
      const modal = document.getElementById('verifyPhoneModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.setAttribute('aria-modal', 'true');
        modal.removeAttribute('aria-hidden');
        document.body.classList.add('modal-open');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }

    closeVerifyPhoneModal() {
      const modal = document.getElementById('verifyPhoneModal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          document.body.removeChild(backdrop);
        }
      }
    }

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }

    openModal() {
        const modal = document.getElementById('reportUserModal');
        if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-modal', 'true');
          modal.removeAttribute('aria-hidden');
          document.body.classList.add('modal-open');
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }

      closeModal() {
        const modal = document.getElementById('reportUserModal');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');

          if (backdrop) {
            document.body.removeChild(backdrop);
          }

        }
      }
    reportAuctionUser(){

      this.closeModal()
      this.loading = true
      let input = {
        user_id: this.auctionUserId
      }
      this.mainServices.reportUser(input).subscribe((res:any) => {
        this.showSuccessMessage(res.message)
        this.loading = false

      })
    }
}
