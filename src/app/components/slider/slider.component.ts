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
  isLoading = false; 
 
  ngOnInit(): void {
  }
}
