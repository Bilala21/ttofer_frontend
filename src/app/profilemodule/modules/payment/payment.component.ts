import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  tabs = ['accounts', 'transaction'];
  activeIndex: number = 1;
  activeCard: number = 1;
  data: any = [];

  getTab(tab: any) {
    this.activeIndex = tab.index;
  }
}
