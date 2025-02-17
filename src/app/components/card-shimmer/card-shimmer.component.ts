import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-shimmer',
  standalone: true,
  imports: [],
  templateUrl: './card-shimmer.component.html',
  styleUrl: './card-shimmer.component.scss'
})
export class CardShimmerComponent {
   @Input() shimmerClass:string = 'shimmer'
}
