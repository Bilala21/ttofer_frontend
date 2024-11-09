import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/shared-components/header/header.component";
import { FooterComponent } from "../../shared/shared-components/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainServicesService } from '../../shared/services/main-services.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-review-page',
    standalone: true,
    templateUrl: './review-page.component.html',
    styleUrl: './review-page.component.scss',
    imports: [HeaderComponent, FooterComponent, StarRatingComponent,NgIf]
})
export class ReviewPageComponent {
userId:any
loading = false;
user:any = {}

@ViewChild('review') reviewText: any;
constructor(
    private mainServices: MainServicesService,
    // private extension: Extension,
    private route: ActivatedRoute,
    // private http: HttpClient,
    private snackBar: MatSnackBar
    // private route: ActivatedRoute,
){}
ngOnInit():void{

    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserInfo()
    // console.log(this.userId)
}
getUserInfo(){

    this.mainServices.getUserInfo(this.userId).subscribe((res:any) =>{
debugger
        this.user = res.data
    })
}
submitReview(starRating: any) {
debugger
    const rating = starRating.rating; // Assuming getRating() returns the selected rating
     const review = this.reviewText?.nativeElement.value;
    const reviewData = {
      to_user:this.userId,
      review_quantity: rating,
      comment:review,
      rating: rating,
      from_user:'39807'
    };
    this.mainServices.reviewToSeller(reviewData).subscribe((res:any) =>{

        this.showSuccessMessage(res.message)
        this.loading = false
        console.log(res)
    })
    // Make an HTTP request to save the review
    // this.http.post('/api/reviews', reviewData).subscribe(response => {
    //   console.log('Review saved successfully', response);
    // }, error => {
    //   console.error('Error saving review', error);
    // });
  }
  showSuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
