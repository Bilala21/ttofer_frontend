import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../components/selling/card/card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { JwtDecoderService } from '../../../shared/services/authentication/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seller-reveiw',
  standalone: true,
  templateUrl: './seller-reveiw.component.html',
  styleUrl: './seller-reveiw.component.scss',
  imports: [ NgFor, NgIf, NgFor,ReactiveFormsModule]
})

export class SellerReveiwComponent {
  reviewForm: FormGroup;
  submitted: boolean = false;
  reviewerId:any;
  seller:any
  constructor(private fb: FormBuilder,private mainService:MainServicesService,private token:JwtDecoderService,private toastr:ToastrService) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]],
      rating: [1, [Validators.required, Validators.min(1)]]
    });
    this.reviewerId=token.decodedToken.id;
    const userData:any=sessionStorage.getItem('user_data')
    this.seller=JSON.parse(userData)
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reviewForm.valid) {
      const payLoad = {
        reviewer_id: this.reviewerId,
        // comment: this.reviewForm.value.comment,
        rating: this.reviewForm.value.rating,
      };

      this.mainService.reviewToSeller(this.seller.id, payLoad).subscribe({
        next: (response:any) => {
          this.toastr.success(response.message, 'Success');
          this.reviewForm.reset();
          this.submitted = false;
        },
        error: (err) => {
         this.submitted = false;
        },
        complete: () => {
        },
      });
    } 
  }
  

  
}
