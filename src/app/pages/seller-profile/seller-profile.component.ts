import { Component } from '@angular/core';
import { NgFor, NgIf,CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { FeedbackCardComponent } from "../../components/feedback-card/feedback-card.component";
import { TabComponent } from "../../profilemodule/modules/purchase-sale/components/tab/tab.component";

@Component({
    selector: 'app-seller-profile',
    standalone: true,
    templateUrl: './seller-profile.component.html',
    styleUrl: './seller-profile.component.scss',
    imports: [NgFor, NgIf, StarRatingComponent, RouterLink, CardShimmerComponent, ProductCardComponent, FeedbackCardComponent, CommonModule, TabComponent]
})
export class SellerProfileComponent  {
    activeTab: any = 'products';
    loading = false;
    showOTPBox= false;
    ProductTabs: any = ['auction', 'featured','review'];
    data:any=[]
    auctionUserName:any
    starsArray: string[] = [];
    activeIndex: number = 1;

    handleTab(tab: any) {
          this.activeIndex = tab.index;
          this.activeTab = tab.value;
    }
    // setActiveTab(tab: string) {
    //     this.activeTab = tab;
    //   }
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
    

    constructor(
      private route: ActivatedRoute,
      private mainServices: MainServicesService,
      private extension: Extension,
      private snackBar: MatSnackBar,
    ){
    }
    ngOnInit():void{
      this.auctionUserName = this.route.snapshot.paramMap.get('name')!;
      this.getSellerDetail(this.auctionUserName)
      this.handleTab('auction')
      this.activeIndex = 1
    }

    showSuccessMessage(message:string) {
      this.snackBar.open(message, '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }

    getSellerDetail(name:any){
      this.mainServices.getSellerInfo(name).subscribe((res:any) =>{
        this.data = res.data;
        this.generateStars(res.data?.review_percentage)
        this.loading = false
      })

    }

    generateStars(review: number): void {
    const maxStars = 5;
    const fullStars = Math.floor(review);
    const halfStar = review % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    // Build the stars array
    this.starsArray = [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
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
        user_id: this.auctionUserName
      }
      this.mainServices.reportUser(input).subscribe((res:any) => {
        this.showSuccessMessage(res.message)
        this.loading = false

      })
    }
}
