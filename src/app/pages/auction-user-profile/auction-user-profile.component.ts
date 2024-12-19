import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { FeedbackCardComponent } from "../../components/feedback-card/feedback-card.component";

@Component({
    selector: 'app-auction-user-profile',
    standalone: true,
    templateUrl: './auction-user-profile.component.html',
    styleUrl: './auction-user-profile.component.scss',
    imports: [NgFor, NgIf, StarRatingComponent, RouterLink, CardShimmerComponent, ProductCardComponent, FeedbackCardComponent]
})
export class AuctionUserProfileComponent {
    activeTab: any = 'products';
    loading = false;
    showOTPBox= false;
    ProductTabs: any = ['auction', 'featured','review'];
    data = [
      {
          id: 4,
          user_id: 13,
          title: "molestiae",
          slug: "quia-et-molestiae-magnam",
          description: "Animi voluptas dolores veritatis minus similique. Nam voluptates et cupiditate libero ad. Impedit temporibus est atque dignissimos nihil sed.",
          attributes: "{\"brand\":\"Samsung\",\"condition\":\"use\",\"storage\":\"32GB\",\"color\":\"White\"}",
          category_id: 2,
          sub_category_id: 98,
          condition: "new",
          is_urgent: 0,
          is_sold: 0,
          is_expired: 0,
          total_review: 214,
          review_percentage: 4.5,
          product_type: "featured",
          fix_price: 158.49,
          firm_on_price: 0,
          location: "5088 Harmon Circle\nNew Nolan, TN 09005-4955",
          longitude: null,
          latitude: null,
          delivery_type: null,
          status: 1,
          created_at: "2024-12-19T06:18:05.000000Z",
          updated_at: "2024-12-19T06:18:05.000000Z",
          is_in_wishlist: false,
          user: {
              id: 13,
              name: "Mr Test 13",
              img: "https://xsgames.co/randomusers/assets/avatars/male/20.jpg"
          },
          category: {
              id: 2,
              name: "Electronics & Appliances",
              slug: "electronics-appliance"
          },
          sub_category: {
              id: 98,
              category_id: 10,
              name: "Accessories"
          },
          photo: {
              id: 12,
              product_id: 4,
              url: "https://picsum.photos/900/400?random=18"
          },
          video: [],
          wishlist: {
              id: 11,
              user_id: 20,
              product_id: 4,
              created_at: "2024-12-19T07:20:35.000000Z",
              updated_at: "2024-12-19T07:20:35.000000Z"
          },
          offer: [],
          auction: []
      },
      {
          id: 7,
          user_id: 10,
          title: "voluptatibus",
          slug: "et-pariatur-et-quas-eum-nobis-recusandae-voluptatem",
          description: "Qui sed vero voluptatem et ut quaerat. Pariatur et iusto consequatur voluptas earum nesciunt molestiae. Aut temporibus eos numquam expedita aut consequuntur aut. Voluptatem ut modi non qui necessitatibus.",
          attributes: "{\"brand\":\"Samsung\",\"condition\":\"use\",\"storage\":\"32GB\",\"color\":\"White\"}",
          category_id: 11,
          sub_category_id: 51,
          condition: "used",
          is_urgent: 0,
          is_sold: 0,
          is_expired: 0,
          total_review: 217,
          review_percentage: 4.9,
          product_type: "featured",
          fix_price: 133.61,
          firm_on_price: 1,
          location: "37618 Strosin Drive\nAndersonchester, CA 09336",
          longitude: null,
          latitude: null,
          delivery_type: null,
          status: 1,
          created_at: "2024-12-19T06:18:05.000000Z",
          updated_at: "2024-12-19T06:18:05.000000Z",
          is_in_wishlist: false,
          user: {
              id: 10,
              name: "Mr Test 10",
              img: "https://xsgames.co/randomusers/assets/avatars/male/24.jpg"
          },
          category: {
              id: 11,
              name: "Kids",
              slug: "kids"
          },
          sub_category: {
              id: 51,
              category_id: 6,
              name: "Scooters"
          },
          photo: {
              id: 24,
              product_id: 7,
              url: "https://picsum.photos/900/400?random=19"
          },
          video: [],
          wishlist: {
              id: 12,
              user_id: 20,
              product_id: 7,
              created_at: "2024-12-19T07:20:37.000000Z",
              updated_at: "2024-12-19T07:20:37.000000Z"
          },
          offer: [],
          auction: []
      },
      {
        id: 4,
        user_id: 13,
        title: "molestiae",
        slug: "quia-et-molestiae-magnam",
        description: "Animi voluptas dolores veritatis minus similique. Nam voluptates et cupiditate libero ad. Impedit temporibus est atque dignissimos nihil sed.",
        attributes: "{\"brand\":\"Samsung\",\"condition\":\"use\",\"storage\":\"32GB\",\"color\":\"White\"}",
        category_id: 2,
        sub_category_id: 98,
        condition: "new",
        is_urgent: 0,
        is_sold: 0,
        is_expired: 0,
        total_review: 214,
        review_percentage: 4.5,
        product_type: "featured",
        fix_price: 158.49,
        firm_on_price: 0,
        location: "5088 Harmon Circle\nNew Nolan, TN 09005-4955",
        longitude: null,
        latitude: null,
        delivery_type: null,
        status: 1,
        created_at: "2024-12-19T06:18:05.000000Z",
        updated_at: "2024-12-19T06:18:05.000000Z",
        is_in_wishlist: false,
        user: {
            id: 13,
            name: "Mr Test 13",
            img: "https://xsgames.co/randomusers/assets/avatars/male/20.jpg"
        },
        category: {
            id: 2,
            name: "Electronics & Appliances",
            slug: "electronics-appliance"
        },
        sub_category: {
            id: 98,
            category_id: 10,
            name: "Accessories"
        },
        photo: {
            id: 12,
            product_id: 4,
            url: "https://picsum.photos/900/400?random=18"
        },
        video: [],
        wishlist: {
            id: 11,
            user_id: 20,
            product_id: 4,
            created_at: "2024-12-19T07:20:35.000000Z",
            updated_at: "2024-12-19T07:20:35.000000Z"
        },
        offer: [],
        auction: []
      },
    ]
    product={
       reviews: [
      {
       reviewer:{
       img: '/assets/images/chat-profile1.png',
       name:'Haroon Irshad',
      },
        created_at: '12/3/2025',
        comment: 'I received my parcel ....   chalany ma acha ha Delivery on time ..... but ya Kisi Crouse ka lia ap pureshes kar rahy ha to I recommend Kay na kareIn ya just web series or YouTube Chala sakty ha Kuch download NH kar sakty memory BuHt Kam ha balky ha hi NH    .....',
        rating: 4,
      },
      {
        reviewer:{
          img: '/assets/images/chat-profile1.png',
          name:'Ahsan Irshad',
        },
        created_at: '11/3/2025',
        comment: 'I received my parcel ....   chalany ma acha ha Delivery on time ..... but ya Kisi Crouse ka lia ap pureshes kar rahy ha to I recommend Kay na kareIn ya just web series or YouTube Chala sakty ha Kuch download NH kar sakty memory BuHt Kam ha balky ha hi NH    .....',
        rating: 3,
      },
    ]
  }
    handleTab(tab: string) {
      this.activeTab = tab
      // localStorage.setItem('categoryTab', tab);
      // const query = localStorage.getItem('isSearch') as string;
      // const selectedSlug = localStorage.getItem('selectedSlug');
      // this.activeTab = tab ? tab : this.setActiveTabs(selectedSlug);
      // this.fecthcData(query == null ? {} : { search: query });
    }
    setActiveTab(tab: string) {
        this.activeTab = tab;
      }
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
    auctionUserList:any={}
    reviewsUserList:any;
    auctionUserId:any;

    constructor(
      private route: ActivatedRoute,
      private mainServices: MainServicesService,
      private extension: Extension,
      private snackBar: MatSnackBar,
    ){
    }
    ngOnInit():void{
      this.auctionUserId = this.route.snapshot.paramMap.get('id')!;
      this.getAuctionUser()
      this.handleTab('auction')
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
        console.log("user",res.data)
        this.auctionUserList = res.data
        this.reviewsUserList = res.data.products
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
