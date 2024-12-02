import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { AuthService } from '../../../shared/services/authentication/Auth.service';
import { Extension } from '../../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../shared/services/main-services.service';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [RouterLink, NgIf,NgFor,CommonModule],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss'
})
export class RightSideComponent {
  @Input() product: any = {};
  @Input()  parsedAttributes: { [key: string]: string | number } = {};
  liveAuction: any[] = [];
  profileImg: any[] = [];
  maxPrice: number = 0;
  calculateRemaningTime!: string;


  constructor(private mainServices:MainServicesService,private router: Router, private globalStateService: GlobalStateService, private toastr: ToastrService, private authService: AuthService,private route:ActivatedRoute,
    public extension: Extension,
  ) {
    this.currentUserid = extension.getUserId();
  }
  productId: any = null
  
  
  loading: boolean = false
  currentUserid: any;
  @Output() handleWishlist = new EventEmitter<any>();
  @Output() handleAddToCart = new EventEmitter<any>();
  ngAfterViewInit(): void {
    // Additional initialization logic can go here if needed
    // this.parseAttributes(); // Ensure parsing occurs after the view is initialized
  }
  ngOnInit(){
    this.productId = this.route.snapshot.paramMap.get('id');
    this.getBid()
  }
  toggleWishlist(item: any) {
    this.handleWishlist.emit(item)
  }

  buyProduct(product: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
  }

  addToCart(product: any) {
    const storedData = localStorage.getItem('key');

    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    else {
      console.log("product",product)
      this.handleAddToCart.emit({...product,quantity:1})
      this.globalStateService.updateCart(product)
    }
  }

  handleProductQty(event: any, product: any) {
    this.globalStateService.updateCart({ ...product, quantity: event.value })
  }

  contactSeller(product: any, user: any): void {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    sessionStorage.setItem('productData', JSON.stringify(product));
    sessionStorage.setItem('userData', JSON.stringify(user));

    this.router.navigate([`/chatBox/${this.currentUserid}`], {
      state: { product, user },
    });
  }

  showOfferModal(modal_type: string) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    this.globalStateService.setOfferModal(modal_type,this.currentUserid,this.productId,this.liveAuction.length)
  }
  getBid() {
    this.loading = true;
    let input = {
      product_id: this.productId,
    };
    this.mainServices.getPlacedBids(input).subscribe((res: any) => {
      this.liveAuction = res.data;

      res.data.forEach((item: any) => {
        if (item.user && item.user.img && this.profileImg.length < 5) {
          const imgObject = { img: item.user.img };
          this.profileImg.push(imgObject);
        }
      });
      if (this.liveAuction && this.liveAuction.length > 0) {
        const prices = this.liveAuction.map((item) => item.price);
        this.maxPrice = Math.max(...prices);
      }
      this.loading = false;
    });
  }
  
}
