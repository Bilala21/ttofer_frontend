import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-post-categories',
  templateUrl: './post-categories.component.html',
  styleUrls: ['./post-categories.component.scss'],
  imports: [CommonModule, RouterLink],
  standalone: true,
})
export class PostCategoriesComponent implements OnInit {
  @Output() setHandleFilter: EventEmitter<any> = new EventEmitter<any>();
  categories: any = [];

  constructor(private globalStateService: GlobalStateService) {}
  ngOnInit() {
    this.globalStateService.currentState.subscribe((state) => {
      //
      this.categories = state.categories.length
        ? [
            ...state.categories,
            {
              color: '#fff7eb',
              ImgSrc: '/assets/images/bit-coin.png',
              name: 'Crypto Market',
              subTitle: 'Coming Soon',
              both: true,
            },
            {
              color: '#fff7eb',
              ImgSrc: '/assets/images/live-3.png',
              name: 'Live Sale',
              subTitle: 'Coming Soon',
              both: true,
            },
          ]
        : [];
    });
  }
  handleFilter(filter:any) {
    this.setHandleFilter.emit(filter);
  }
}
