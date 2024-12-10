import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  imports: [RouterLink, NgIf, NgFor, CommonModule],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss',
})
export class RightSideComponent {
  @Input() product: any = {};
  @Input() parsedAttributes: { [key: string]: string | number } = {};
  liveAuction: any[] = [];
  profileImg: any[] = [];
  maxPrice: number = 0;
  calculateRemaningTime!: string;
  productId: any = null;
  liveBidsSubscription: any;
  highBid: any;
  highestBid: any;
  loading: boolean = false;
  currentUserid;
  selectedQty = 1;
  @Output() handleWishlist = new EventEmitter<any>();
  @Output() handleAddToCart = new EventEmitter<any>();
  constructor(
    private mainServices: MainServicesService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public extension: Extension
  ) {
    this.currentUserid = extension.getUserId();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.highestBid = this.globalStateService.hightBids$.subscribe(
      (highestBid) => {
        this.highBid = highestBid; 
      }
    );
    this.getBid();
  }
  toggleWishlist(item: any) {
    this.handleWishlist.emit(item);
  }

  buyProduct(product: any) {
    if (!this.currentUserid) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
  }

  addToCart(item: any) {
    this.mainServices
      .adToCartItem({
        product_id: item.id,
        user_id: this.currentUserid,
        quantity: this.selectedQty ? this.selectedQty : 1,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, 'success');
          this.mainServices.getCartProducts(this.currentUserid).subscribe({
            next: (value: any) => {
              this.globalStateService.updateCart(value.data);
            },
            error: (err) => {
              //(err);
            },
          });
        },
        error: (err) => {
          if (err.error.code == 422) {
            this.toastr.error('This product is already in your cart', 'error');
          }
        },
      });
  }

  handleProductQty(event: any, product: any) {
    if (event.value <= product.inventory.available_stock) {
      this.selectedQty = event.value;
      this.product.inventory.available_stock - event.value;
      event.classList.remove('disabled')
    }
    else{
      event.classList.add('disabled')
      event.value=product.inventory.available_stock
      this.selectedQty=product.inventory.available_stock
    }
  }

  contactSeller(product: any, user: any): void {
    if (!this.currentUserid) {
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
    if (!this.currentUserid) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    this.globalStateService.setOfferModal(
      modal_type,
      this.currentUserid,
      this.productId,
      this.liveAuction.length,
      this.product.fix_price,
      this.product.user.id
    );
  }
  // getHighBid(){
  //   this.mainServices.getHighBid({product_id:this.productId}).subscribe({
  //     next:(res:any)=>{
  //     this.highBid= res.data.price
  //     },
  //     error:(err:any)=>{
  //       this.toastr.error(
  //         err.message,
  //               'error'
  //             );
  //     }
  //   })
  // }
  getBid() {
    this.loading = true;
    let input = {
      product_id: this.productId,
    };
    this.mainServices.getPlacedBids(input).subscribe((res: any) => {
      this.globalStateService.setLiveBids(res.data);
      this.liveBidsSubscription = this.globalStateService.liveBids$.subscribe(
        (liveBids) => {
          this.liveAuction = liveBids;
        }
      );
      this.loading = false;
    });
  }
}
