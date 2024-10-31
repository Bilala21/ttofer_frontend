import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'] // Corrected to styleUrls
})
export class ProductCarouselComponent implements OnInit, OnChanges {

  @Input() photo: any[] = [];
  @Input() video: any[] = [];
  media: any[] = [];
  selectedImage: any;

  ngOnInit(): void {
    // Initialize the media list and select the first image or video
    this.media = this.photo.length > 0 ? this.photo : this.video;
    this.selectedImage = this.media[0];
  }

  ngOnChanges(): void {
    // Update media and selected image when inputs change
    this.media = this.photo.length > 0 ? this.photo : this.video;
    this.selectedImage = this.media.length > 0 ? this.media[0] : null; // Safety check for empty media
  }

  selectImage(image: any): void {
    this.selectedImage = image;
  }

  previousImage(): void {
    const currentIndex = this.media.indexOf(this.selectedImage);
    const previousIndex = (currentIndex === 0) ? this.media.length - 1 : currentIndex - 1;
    this.selectedImage = this.media[previousIndex];
  }

  nextImage(): void {
    const currentIndex = this.media.indexOf(this.selectedImage);
    const nextIndex = (currentIndex === this.media.length - 1) ? 0 : currentIndex + 1;
    this.selectedImage = this.media[nextIndex];
  }

  onImageLoad(): void {
    const imageElement = document.querySelector('.main-image') as HTMLImageElement;
    if (imageElement) {
      imageElement.style.filter = 'none'; // Remove blur once loaded
    }
  }
}
