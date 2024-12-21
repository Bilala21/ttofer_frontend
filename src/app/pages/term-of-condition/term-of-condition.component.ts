import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-term-of-condition',
  standalone: true,
  templateUrl: './term-of-condition.component.html',
  styleUrls: ['./term-of-condition.component.css'],
  imports: [CommonModule]
})
export class TermOfConditionComponent implements OnInit {
  supportEmail!:string;
  constructor() { }

  ngOnInit() {
    this.supportEmail='support@ttoffer.com';
  }

}
