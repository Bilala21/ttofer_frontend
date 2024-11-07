import { Component, OnInit } from '@angular/core';
import { GlobalStateService } from '../../services/state/global-state.service';
@Component({
  selector: 'app-post-categories',
  templateUrl: './post-categories.component.html',
  styleUrls: ['./post-categories.component.scss']
})
export class PostCategoriesComponent implements OnInit {
  categories: any = []

  constructor(private globalStateService: GlobalStateService) { }
  ngOnInit() {
    this.globalStateService.currentState.subscribe((state) => {
      this.categories = [...state.categories, { color: "#fff7eb", ImgSrc: '/assets/catImage/bit-coin.png', name: 'Crypto Market', subTitle: 'Coming Soon' }]
    })
  }

}
