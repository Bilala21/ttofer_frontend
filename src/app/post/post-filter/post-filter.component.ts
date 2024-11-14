import { category } from './../../shared/Models/Product/category';
import { productCondition } from '../../shared/Models/Product/productCondition';
import { LookupService } from './../../shared/services/lookup/lookup.service';
import { Component, OnInit } from '@angular/core';
import { subCategory } from '../../shared/Models/Product/SubCategory';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.css']
})
export class PostFilterComponent implements OnInit {
  isCollapsedSubCategory = false;
  isCollapsedSellerType = false;
  isCollapsedLocation = false;
  isCollapsedCondition = false;
  isCollapsedPrice=false;
  minPrice: number = 150;
  maxPrice: number = 670;
  min: number = 0;
  max: number = 1000;
  category_id:number|null = null;
  condition! : productCondition []
  subCategories! : subCategory []
  categories! : category []
  categoryName:string|null = null;
  constructor(private lookupService:LookupService,
    private route: ActivatedRoute
  ) {
    this.fetchCategoryId(); // Convert to number using the + operator
    this.loadSubcategories();

  }

  async ngOnInit() {
    await this.GetConditions();

  }
  private async GetConditions() {
    this.condition = await this.lookupService.GetProductConditionOptions();
  }

  private fetchCategoryId() {
    const id = this.route.snapshot.paramMap.get('id'); // Catch id from route
    this.category_id = id ? +id : null;
  }

  private loadSubcategories() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this.category_id = id ? +id : null;

      if (this.category_id) {
        this.categories = await this.lookupService.GetProductCategories();
        this.categoryName = this.categories.filter(x => x.id == this.category_id)[0].name;
        this.subCategories = await this.lookupService.GetProductSubCategories(this.category_id);
      } else {
        this.subCategories = [];
      }
    });
  }

  toggleCollapse(section: string) {
    if (section === 'subCategory') {
      this.isCollapsedSubCategory = !this.isCollapsedSubCategory;
    } else if (section === 'sellerType') {
      this.isCollapsedSellerType = !this.isCollapsedSellerType;
    }
    else if (section === 'location') {
      this.isCollapsedLocation = !this.isCollapsedLocation;
    }
    else if (section === 'condition') {
      this.isCollapsedCondition = !this.isCollapsedCondition;
    }
    else if (section === 'price') {
      this.isCollapsedPrice = !this.isCollapsedPrice;
    }

  }
  updateMinPrice() {
    if (this.minPrice > this.maxPrice - 1) {
      this.minPrice = this.maxPrice - 1;
    }
  }

  updateMaxPrice() {
    if (this.maxPrice < this.minPrice + 1) {
      this.maxPrice = this.minPrice + 1;
    }
  }
}
