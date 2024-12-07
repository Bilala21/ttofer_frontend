import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import { CardShimmerComponent } from '../../../components/card-shimmer/card-shimmer.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  tabs = ['accounts', 'transaction'];
  activeIndex: number = 1;
  activeCard: number = 1;
  data: any = [];
  loading = true;

  // This data is teporary
  paymentDeposit: any[] = [
    {
      img: 'assets/images/Applelogo.svg',
      name: 'Apply Pay',
      isDefault: true,
    },
    {
      img: 'assets/images/visalogo.svg',
      name: 'Visa',
      isDefault: false,
    },
    {
      img: 'assets/images/StripLogo.svg',
      name: 'Mastercard',
      isDefault: false,
    },
    {
      img: 'assets/images/GPay.svg',
      name: 'Google Pay',
      isDefault: false,
    },
  ];

  constructor(public dialog: MatDialog) {}

  getTab(tab: any) {
    this.activeIndex = tab.index;
    this.loading=true
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewCardComponent, {
      width: '470px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //(result);
    });
  }

  hadleMakeDefault(name: string) {
    this.paymentDeposit.find((card) => {
      if (card.name === name) {
        card.isDefault = true;
      } else {
        card.isDefault = false;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
}
