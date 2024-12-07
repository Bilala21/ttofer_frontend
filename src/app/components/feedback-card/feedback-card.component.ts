import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-card',
  templateUrl: './feedback-card.component.html',
  styleUrls: ['./feedback-card.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class FeedbackCardComponent {
  // @Input() name: string = 'Default Name';
  // @Input() email: string = 'default@example.com';
  // @Input() imageSrc: string = '/assets/images/default-profile.jpg';
  // @Input() amount: string = '$0';

  data = [
    {
      name: 'Jane Doe',
      img: '/assets/images/chat-profile1.png',
      date: '12/3/2025',
      para: 'I received my parcel ....   chalany ma acha ha Delivery on time ..... but ya Kisi Crouse ka lia ap pureshes kar rahy ha to I recommend Kay na kareIn ya just web series or YouTube Chala sakty ha Kuch download NH kar sakty memory BuHt Kam ha balky ha hi NH    .....',
      rating: 4,
    },
    {
      name: 'Haroon Irshad',
      img: '/assets/images/chat-profile2.png',
      date: '11/3/2025',
      para: 'I received my parcel ....   chalany ma acha ha Delivery on time ..... but ya Kisi Crouse ka lia ap pureshes kar rahy ha to I recommend Kay na kareIn ya just web series or YouTube Chala sakty ha Kuch download NH kar sakty memory BuHt Kam ha balky ha hi NH    .....',
      rating: 3,
    },
  ];
  createArray(num: any) {
    const arr = [...Array(num)].map((_, i) => i + 1);
    return arr;
  }
}
