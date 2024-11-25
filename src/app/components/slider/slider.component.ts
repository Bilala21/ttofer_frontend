import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports:[CommonModule]
})
export class SliderComponent implements OnInit {
 @Input() slides: any[] = [];
               slide:any = []
  isLoading = true; // Flag to show shimmer globally

  ngOnInit(): void {
    // Simulating API call to fetch images
    setTimeout(() => {
      this.isLoading = false
    //   this.slide = [
    //     {
    //       image:
    //         'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
    //       isLoaded: false,
    //     },
    //     {
    //       image:
    //         'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
    //       isLoaded: false,
    //     },
    //     {
    //       image:
    //         'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9d56fb9fb543451d.jpg?q=20',
    //       isLoaded: false,
    //     },
    //   ];
    //   this.isLoading = false
    }, 2000);
  }
}
