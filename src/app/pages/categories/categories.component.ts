import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { SharedModule } from "../../shared/shared.module";
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [SharedModule, AppFiltersComponent, ProductCardComponent, CardShimmerComponent, NgIf]
})
export class CategoriesComponent {
  constructor(private route: ActivatedRoute, public globalStateService: GlobalStateService, private mainServices: MainServicesService, private countdownTimerService: CountdownTimerService, private cd: ChangeDetectorRef) {
  }
  promotionBanners: any = []
  activeTab: any = "auction"
  data: any = {}
  id: any = null
  currentPage: number = 1
  handleTab(tab: string) {
      this.activeTab = tab
      localStorage.setItem('categoryTab', tab);
      this.globalStateService.updateProdTab("ProductType", tab)
  }
  ngOnInit(): void {
    const savedTab = localStorage.getItem('categoryTab');
    this.activeTab = savedTab ? savedTab : "auction";
    this.getBanners()

    this.globalStateService.currentState.subscribe((state) => {
      this.currentPage = state.filteredProducts?.current_page
      // debugger
      this.data=state.filteredProducts.filter((item: any) => item.product_type == this.activeTab);
      this.globalStateService.productlength = this.data?.length
      this.globalStateService.loading=false
    })
    this.route.paramMap.subscribe(params => {
      // debugger
      this.id = params.get('id');
      if (["3", "4", "8"].includes(this.id)) {
        this.handleTab('featured')
      } else {
          this.handleTab(this.activeTab)
      }
    });

  }
  getBanners() {
    this.mainServices.getBanners().subscribe({
      next: (res) => {
        this.promotionBanners = res.data.map((item: any) => {
          return {
            banner: item?.img
          }
        })
      },
      error: (error) => {
        console.error('Error occurred while fetching data', error);
      }
    })
  }

  handleLoadMore(page: number) {
    let filters = JSON.parse(localStorage.getItem("filters") as string)
    const modifiedFilter = { ...filters, page: page + 1, location: filters.location.join(',') };
    ;

    this.mainServices.getFilteredProducts(modifiedFilter).subscribe({
      next: (res: any) => {
        if (res && res.data.data) {
          this.globalStateService.setFilteredProducts(res.data.data);
          this.globalStateService.isFilterActive(true)
        } else {
          console.log('No data found in response');
        }
      },
      error: (err) => {
        console.log('Error fetching filtered products', err);
      }
    });
  }

    ngOnDestroy() {
    // Remove specific filter data key from localStorage
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem("categoryTab");
    localStorage.removeItem("categoryId");
  }

}
