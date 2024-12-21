import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selling-notfound',
  standalone: true,
  imports: [NgIf],
  templateUrl: './selling-notfound.component.html',
  styleUrl: './selling-notfound.component.scss'
})
export class SellingNotfoundComponent {
  @Input() image: string = ""
  @Input() heading: string = ""
  @Input() text: string = ""
  constructor() { }
}
