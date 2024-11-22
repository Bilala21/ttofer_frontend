import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../shared/shared-components/header/header.component";
import { FooterComponent } from "../../shared/shared-components/footer/footer.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SellingNotfoundComponent } from '../../components/selling/selling-notfound/selling-notfound.component';
import { TabsComponent } from '../../components/selling/tabs/tabs.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardComponent } from '../../components/selling/card/card.component';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';

@Component({
  selector: 'app-selling',
  standalone: true,
  templateUrl: './selling.component.html',
  styleUrl: './selling.component.scss',
  imports: [FormsModule, CommonModule, RouterLink, NgIf, NgFor]
})

export class SellingComponent {
  // loading = false;
  // apiData: any = {}
  // activeTab: string = "selling"
  // tabs: any = [
  //   { index: 1, tabName: "selling" },
  //   { index: 2, tabName: "purchase" },
  //   { index: 3, tabName: "archive" }
  // ]

  // notFoundData: any = {
  //   "selling": {
  //     tabName: "selling",
  //     image: "/assets/sellling/selling-notfoun1.png",
  //     heading: "Begin Selling Items!",
  //     text: "Make local buying and selling easy and straightforward!",
  //   },
  //   "purchase": {
  //     tabName: "buying",
  //     image: "/assets/sellling/selling-notfoun1.png",
  //     heading: "Begin Buying Items!",
  //   },
  //   "archive": {
  //     tabName: "archive",
  //     image: "/assets/sellling/archive.png",
  //     heading: "When you archive an item, it’ll appear here",
  //   }
  // }
  // cardData: any = {
  //   1: [
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold",
  //       status: "Unarchive",
  //       views: "100 View",
  //       users: [
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //       ]
  //     },
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold"
  //     },
  //   ],
  //   2: [
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold",
  //       status: "Unarchive",
  //       views: "40 View",
  //       users: [
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //       ]
  //     },
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold"
  //     },
  //   ],
  //   3: [
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold",
  //       status: "Unarchive",
  //       views: "60 View",
  //       users: [
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img1.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //         {
  //           image: "/assets/images/tempImage/img2.jpeg",
  //         },
  //       ]
  //     },
  //     {
  //       tabName: "selling",
  //       image: "/assets/images/tempImage/img2.jpeg",
  //       heading: "Begin Selling Items 12!",
  //       sold: "Sold"
  //     },
  //   ],
  // };

  // constructor(
  //   private globalStateService: GlobalStateService, private mainServicesService: MainServicesService
  // ) {

  // }
  // async getData() {
  //   this.loading=true
  //   this.mainServicesService.getSelling().subscribe({
  //     next: (res: any) => {
  //       this.apiData = res.data;
  //       this.loading=false
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading=false
  //     },
  //   });
  // }

  // ngOnInit(): void {
  //   this.globalStateService.currentState.subscribe(state => {
  //     this.activeTab = state.tab.tabName;
  //   });
  //   this.getData()
  // }
  showPerformance:boolean = false;
  sellingId:any;
  currentUserid:number = 0;
  sellingList: any = [];
  whoBouthList:any;
  loading = false;
  // chatBox: any[]= [
  //   // {img:'assets/images/chat-profile1.png', name:'Elmer Laverty', text:'Haha oh man 🔥', time:'12m'},
  //   // {img:'assets/images/chat-profile2.png', name:'Florencio Dorrance', text:'woohoooo', time:'24m'},
  //   // {img:'assets/images/chat-profile3.png', name:'Lavern Laboy', text:`Haha that's terrifying 😂`, time:'1h'},
  //   // {img:'assets/images/chat-profile4.png', name:'Titus Kitamura', text:'omg, this is amazing', time:'5h'},
  // ]
  message:any [] = [
    // {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    // {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    // {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    // {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
  ]
  constructor(
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    private extension: Extension,public router:Router
  ){
    this.currentUserid = extension.getUserId()
  }
  ngOnInit():void{
    this.sellingId = this.route.snapshot.paramMap.get('id')!;
    this.getSelling();
    this.getAllChatsOfUser();
    this.whoBought();
  }
  openTab(){
    this.showPerformance = !this.showPerformance
  }
  getSelling() {
    this.loading = true
    this.mainServices.getSelling().subscribe((res:any) => {
      debugger
      this.sellingList = res.data.selling.data
      this.sellingList = this.sellingList?.filter((item:any) => {
        return item.id == this.sellingId;
      });
      console.log(this.sellingList)
      this.loading = false
    })
  }
  markAsSold(prodictId:any){
    console.log('sold out ', prodictId)
    this.mainServices.markAsSold(prodictId).subscribe(res =>{

      res
    })
  }
  getAllChatsOfUser = () => {

    this.loading = true
    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res:any) =>{

      this.message = res.data
      console.log(this.message)
      this.loading = false
    });
  }
  whoBought(){
    let input = {
      user_id: this.currentUserid
    }
    this.mainServices.whoBought(input).subscribe(res =>{

      res
      this.whoBouthList = res
      console.log('who bought',this.whoBouthList)
    })
  }
  editPost() {
    // Check if sellingList exists and is not empty
    if (this.sellingList && this.sellingList.length > 0) {
      // Convert the sellingList array to a JSON string
      const sellingListString = JSON.stringify(this.sellingList[0]);
  
      // Store the JSON string in local storage
      localStorage.setItem('editProduct', sellingListString);
      localStorage.setItem('currentTab', 'editPost');

      // Navigate to the product details page using Angular Router (for example, the first item in the list)
      const postId = this.sellingList[0].id;
      this.router.navigate(['/profilePage', postId]);
    } else {
    }
  }
  
  
}
