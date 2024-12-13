import { Component } from '@angular/core';
import { CardShimmerComponent } from '../../../../../components/card-shimmer/card-shimmer.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { Extension } from '../../../../../helper/common/extension/extension';
import { TabComponent } from '../../../purchase-sale/components/tab/tab.component';
import { JwtDecoderService } from '../../../../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgIf, CommonModule, NgFor, CardShimmerComponent, TabComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  tabs = ['all', 'unread', 'read'];
  activeIndex: number = 1;
  userId: number;
  data: any = [];
  loading: boolean = false;
  character: number = 250;
  currentIndex: any = null;
  constructor(
    private mainService: MainServicesService,
    private token:JwtDecoderService
  ) {
    this.userId = token.decodedToken
  }
  fecthData(userId: number, type?: string) {
    this.loading = true;
    this.mainService.getNotification(userId, type).subscribe({
      next: (res: any) => {
        this.data = res.data;
        if(this.data?.length > 0){
          this.data = this.data.sort((a: any, b: any) => {
            return (
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          });
          this.data = this.data.map((chat:any) => {
            return {
              ...chat,
              formattedTime: this.timeAgo(chat.created_at),
            };
          });
        }     
        this.loading = false;
      },
      error: (err:any) => {
        this.data = [];
        this.loading = false;
      },
    });
  }
  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals = {
      year: 365 * 24 * 60 * 60,
      month: 30 * 24 * 60 * 60,
      week: 7 * 24 * 60 * 60,
      day: 24 * 60 * 60,
      h: 60 * 60,
      m: 60,
      s: 1,
    };
    for (const key in intervals) {
      const interval = Math.floor(
        seconds / intervals[key as keyof typeof intervals]
      );
      if (interval > 1) {
        return `${interval} ${key} ago`;
      } else if (interval === 1) {
        return `1 ${key} ago`;
      }
    }
    return 'just now';
  }
  loadMore() {
    this.fecthData(this.userId, this.tabs[this.activeIndex - 1]);
  }
  readMore(index: number) {
    this.currentIndex = index;
  }
  readLess() {
    this.currentIndex = null;
  }
  getTab(tab: any) {
    this.activeIndex = tab.index;
    if (this.tabs.includes(tab.value)) {
      if(tab.value=='all'){
        this.fecthData(this.userId);
      }else{
        this.fecthData(this.userId, tab.value);
      }
    }
  }
  ngOnInit(): void {
    this.fecthData(this.userId,);
  }
}
