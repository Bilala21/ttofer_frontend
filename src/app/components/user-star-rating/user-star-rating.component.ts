import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-star-rating',
  templateUrl: './user-star-rating.component.html',
  styleUrls: ['./user-star-rating.component.css']
})
export class UserStarRatingComponent implements OnInit {
  @Input() rating: number = 0; 
  @Input() maxRating: number = 5; 
  @Input() allowRating!:boolean;
  stars: boolean[] = [];
  constructor() { }

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(false);
    console.log(this.allowRating);
  }

  rate(rating: number) {
    this.rating = rating;
  }

}
