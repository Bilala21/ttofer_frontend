import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  slides: any[] = [];
  isLoading = true; // Flag to show shimmer globally

  ngOnInit(): void {
    // Simulating API call to fetch images
    setTimeout(() => {
      this.slides = [
        {
          image:
            'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
          isLoaded: false,
        },
        {
          image:
            'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
          isLoaded: false,
        },
        {
          image:
            'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
          isLoaded: false,
        },
      ];
      this.isLoading = false
    }, 2000);
  }
}
