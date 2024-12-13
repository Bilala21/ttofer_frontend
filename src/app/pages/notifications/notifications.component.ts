import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    NgFor,
    CardShimmerComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  activeTab: string = 'all'
  userId: number
  notificatons: any = []
  loading: boolean = false
  character: number = 250
  currentIndex: any = null
  description = `
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptatem
                        reiciendis eum earum reprehenderit dolores? Repellendus perspiciatis pariatur molestias, animi,
                        vero
                        error modi ab eum in placeat quas consequatur recusandae!,
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptatem
                        reiciendis eum earum reprehenderit dolores? Repellendus perspiciatis pariatur molestias, animi,
                        vero
                        error modi ab eum in placeat quas consequatur recusandae
  `
  constructor(private mainService: MainServicesService, private token:JwtDecoderService) {
    this.userId = token.decodedToken
  }
  getUserNotifications(userId: number) {
    this.loading = true
    this.mainService.getNotification(userId,'all').subscribe({
      next: (res: any) => {
        this.notificatons = res.data
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      }
    })
  }

  handleTab(tab: string) {
    this.activeTab = tab
    this.getUserNotifications(this.userId)
  }
  loadMore() {
    this.getUserNotifications(this.userId)
  }
  readMore(index: number) {
    this.currentIndex = index
  }
  readLess() {
    this.currentIndex = null
  }

  ngOnInit(): void {
    this.getUserNotifications(this.userId)
  }
}
