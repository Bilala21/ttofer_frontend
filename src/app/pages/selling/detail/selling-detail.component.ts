import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../components/selling/card/card.component';

@Component({
  selector: 'app-selling-detail',
  standalone: true,
  templateUrl: './selling-detail.component.html',
  styleUrl: './selling-detail.component.scss',
  imports: [RouterLink,NgFor,CardComponent]
})

export class SellingDetailComponent {
  buttonData: any = [
    {
      text: "View <br/> Post",
      href: "#",
      img: "/assets/images/icons/eye.png",
    },
    {
      text: "Edit <br/> Post",
      href: "#",
      img: "/assets/images/icons/edit.png",
    },
    {
      text: "Mark as<br/> Sold",
      href: "#",
      img: "/assets/images/icons/bookmark.png",
    },
    {
      text: "Sell <br/>Faster",
      href: "#",
      img: "/assets/images/icons/trend-up.png",
    },
  ]
}
