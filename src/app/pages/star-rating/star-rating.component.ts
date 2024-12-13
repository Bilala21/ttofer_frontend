import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Current rating
  @Input() maxRating: number = 5; // Maximum rating, default is 5
  @Input() allowRating: boolean = true; // Allows rating if true
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  stars: boolean[] = [];

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(false);
    this.updateStarArray();
  }

  rate(starIndex: number) {
    if (this.allowRating) {
      this.rating = starIndex + 1;
      this.ratingChange.emit(this.rating);
      this.updateStarArray();
    }
  }

  private updateStarArray() {
    this.stars = Array.from({ length: this.maxRating }, (_, i) => i < this.rating);
  }
}
