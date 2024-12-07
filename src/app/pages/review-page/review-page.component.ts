import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MainServicesService } from '../../shared/services/main-services.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-page',
  standalone: true,
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'], // Corrected to styleUrls
  imports: [StarRatingComponent,NgIf]
})
export class ReviewPageComponent {
  @ViewChild('review') reviewText!: ElementRef;

  userId: any;
  currentUserId: any;
  loading = false;
  user: any = {};
  isSubmitting = false;

  constructor(
    private mainServices: MainServicesService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute // For accessing route params if needed
  ) {}

  ngOnInit(): void {
    // Assume userId and currentUserId are initialized correctly
    this.userId = this.route.snapshot.params['id']; // Adjust based on your routing
    this.currentUserId = 1; // Replace with actual logic to fetch current user ID

    this.mainServices.getProfileData().subscribe({
      next: (res: any) => {
        console.log('Profile data:', res.data);
        this.user = res.data; // Assign user data if needed
      },
      error: (error: any) => {
        console.error('Error fetching profile data:', error);
      }
    });
  }

  submitReview(starRating: any): void {
    if (this.isSubmitting) return;

    const rating = starRating.rating;
    const reviewElement = this.reviewText?.nativeElement;

    if (!reviewElement) {
      this.toastr.error('Review input is not available.', 'Error');
      return;
    }

    const review = reviewElement.value;

    if (!review.trim()) {
      this.toastr.warning('Please write a review before submitting.', 'Warning');
      return;
    }

    this.isSubmitting = true;

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
        reviewElement.value = ''; // Clear input after successful submission
      },
      (error: any) => {
        console.error('Error submitting review:', error);
        this.toastr.error('Failed to submit review.', 'Error');
        this.isSubmitting = false;
      }
    );
  }

  skipReview(): void {
    this.location.back();
  }
}
