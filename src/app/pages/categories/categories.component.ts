import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { SharedModule } from "../../shared/shared.module";
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { forkJoin } from 'rxjs';
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
  imports: [SharedModule, AppFiltersComponent, ProductCardComponent, CardShimmerComponent,NgIf]
})
export class CategoriesComponent {
  constructor(private route: ActivatedRoute, private globalStateService: GlobalStateService, private mainServices: MainServicesService, private countdownTimerService: CountdownTimerService, private cd: ChangeDetectorRef) {
  }
  promotionBanners: any = []
  activeTab: any = "auction"
  data: any = []
  loading: any = true
  id: any = null
  handleTab(tab: string) {

    this.activeTab = tab
    this.globalStateService.updateProdTab("ProductType", tab)
  }
  ngOnInit(): void {
    this.getBanners()

    this.globalStateService.currentState.subscribe((state) => {
      this.data = state.filteredProducts.filter((item:any) => item.ProductType == this.activeTab );
      this.globalStateService.productlength = state.filteredProducts?.length
      this.loading = false
    })
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    if(["3","4","8"].includes(this.id)){
      this.handleTab('featured')
    }else{
       this.handleTab("auction")
      }
    });
    
  }
  getBanners(){
    this.mainServices.getBanners().subscribe({
      next:(res)=>{
          this.promotionBanners = res.data.map((item:any)=>{
            return{
              banner:item?.img
            }
          })
      },
      error:(error)=>{
        console.error('Error occurred while fetching data', error);
      }
    })
  }
}
