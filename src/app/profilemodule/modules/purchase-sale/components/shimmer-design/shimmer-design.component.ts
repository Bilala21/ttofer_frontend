import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shimmer-design',
  standalone: true,
  templateUrl: './shimmer-design.component.html',
  styleUrl: './shimmer-design.component.scss',
  imports:[NgFor]
})
export class ShimmerDesignComponent {}
