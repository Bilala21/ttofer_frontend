import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Current rating
  @Input() maxRating: number = 3; // Maximum rating, default is 5
  @Input() allowRating!:boolean;
  stars: boolean[] = [];
  constructor(){
    
  }
  ngOnInit() {
    this.stars = Array(this.maxRating).fill(false);
    console.log(this.allowRating);
  }

  rate(rating: number) {
    this.rating = rating;
  }
}
