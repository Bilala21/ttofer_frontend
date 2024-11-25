import { Component, ElementRef, ViewChild } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Location, NgIf } from '@angular/common';
import { Extension } from '../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-review-page',
    standalone: true,
    templateUrl: './review-page.component.html',
    styleUrl: './review-page.component.scss',
    imports: [FooterComponent, StarRatingComponent,NgIf]
})
export class ReviewPageComponent {
userId:any
loading = false;
user:any = {};
isSubmitting = false;
currentUserId:any
@ViewChild('review') reviewText!: ElementRef;
constructor(
    private mainServices: MainServicesService,
   private extension: Extension,
    private route: ActivatedRoute,
    // private http: HttpClient,
    private toastr: ToastrService,
    private location: Location
    // private route: ActivatedRoute,
){}
ngOnInit():void{
  this.currentUserId = this.extension.getUserId();
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserInfo()
    // console.log(this.userId)
}
getUserInfo(){

    this.mainServices.getUserInfo(this.userId).subscribe((res:any) =>{
        this.user = res.data
    })
}
submitReview(starRating: any) {
  if (this.isSubmitting) return; 
  this.isSubmitting = true; 
  const rating = starRating.rating;
  const review = this.reviewText.nativeElement.value;

  const reviewData = {
    to_user: this.userId,
    comment: review,
    rating: rating,
    from_user: this.currentUserId
  };

  this.mainServices.reviewToSeller(reviewData).subscribe(
    (res: any) => {
      this.toastr.success(res.message, 'Success');
      this.isSubmitting = false; 
    },
    (error) => {
      this.toastr.error('Failed to submit review.', 'Error');
      this.isSubmitting = false; 
    }
  );
}

skipReview() {
  this.location.back();
}
}
