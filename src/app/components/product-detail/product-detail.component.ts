import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from 'express';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    // private authService: AuthService,
    // private extension: Extension,
    // private snackBar: MatSnackBar,
    // private router: Router,
  ) { }
  productId: any = null
  product: any = {}
  loading: boolean = false
  imgIndex:number=0
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ]
  handleImage(flag: string) {

  }
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
    console.log(this.imgIndex);
  }
}
