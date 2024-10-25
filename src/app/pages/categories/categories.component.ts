import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { SharedModule } from "../../shared/shared.module";
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { forkJoin } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [SharedModule, AppFiltersComponent, ProductCardComponent, CardShimmerComponent]
})
export class CategoriesComponent {
  constructor(private globalStateService: GlobalStateService, private mainServices: MainServicesService, private countdownTimerService: CountdownTimerService,private cd:ChangeDetectorRef) {
   }
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ]
  activeTab: any = "auction"
  data: any = []
  loading: any = true
  handleTab(tab: string) {
   
    this.activeTab = tab
    this.globalStateService.updateProdTab("ProductType", tab)
  }
  ngOnInit(): void {
    this.handleTab(this.activeTab)

    this.globalStateService.currentState.subscribe((state) => {
      this.data = state.filteredProducts;
      this.globalStateService.productlength=this.data.length
     this.loading=false
    })
      
  }
}
