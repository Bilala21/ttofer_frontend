import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from 'express';
import { CommonModule,  NgIf } from '@angular/common';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule,NgIf],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  constructor( private globalStateService: GlobalStateService,private toastr: ToastrService,private authService:AuthService,
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    // private authService: AuthService,
    // private extension: Extension,
    // private snackBar: MatSnackBar,
    // private router: Router,
  ) { }
  productId: any = null
  product: any = {};
  wishList: any = []
  currentUser: any = {}
  loading: boolean = false
  imgIndex:number=0
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ]
 
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true
    this.mainServices.getProductById({product_id:this.productId}).subscribe({
      next: (value) => {
        console.log(value);
        this.product = value.data
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }
  toggleWishlist(item: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }  
    
    this.globalStateService.wishlistToggle(item.id);
    this.globalStateService.currentState.subscribe(state => {
      this.wishList = state.wishListItems
      this.currentUser = state.currentUser
    });
    let input = {
      user_id: this.currentUser.id,
      product_id: item.id
    }
    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Product added to wishlist successfully', 'Success');
        }
        console.log(res, "toggleWishlist");
      },
      error: (err) => {
        const error=err.error.message
        this.toastr.error(error, 'Error');
      },
    })
  }
  buyProduct(product:any){
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }  
  }
  addToCart(product:any){
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }  
  }
}
