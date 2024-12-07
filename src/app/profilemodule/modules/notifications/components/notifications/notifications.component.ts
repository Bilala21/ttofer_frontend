import { Component } from '@angular/core';
import { CardShimmerComponent } from '../../../../../components/card-shimmer/card-shimmer.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { Extension } from '../../../../../helper/common/extension/extension';
import { TabComponent } from '../../../purchase-sale/components/tab/tab.component';

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
  description = `
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptatem
                        reiciendis eum earum reprehenderit dolores? Repellendus perspiciatis pariatur molestias, animi,
                        vero
                        error modi ab eum in placeat quas consequatur recusandae!,
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptatem
                        reiciendis eum earum reprehenderit dolores? Repellendus perspiciatis pariatur molestias, animi,
                        vero
                        error modi ab eum in placeat quas consequatur recusandae
  `;

  constructor(
    private mainService: MainServicesService,
    private extension: Extension
  ) {
    this.userId = extension.getUserId();
  }

  fecthData(userId: number, type: string) {
    this.loading = true;
    this.mainService.getNotification(userId, type).subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.data = [];
        this.loading = false;
      },
    });
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
      this.fecthData(this.userId, tab.value);
    }
  }

  ngOnInit(): void {
    this.fecthData(this.userId, 'all');
  }
}
