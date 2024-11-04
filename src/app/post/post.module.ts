import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostCardComponent } from './post-card/post-card.component';
import { PostComponent } from './post/post.component';
import { PostFilterComponent } from './post-filter/post-filter.component';
import { PostCategoryComponent } from './post-category/post-category.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostGalleryComponent } from './post-gallery/post-gallery.component';
import { SinglePostDetailComponent } from './single-post-detail/single-post-detail.component';
import { PostHeadingComponent } from './post-heading/post-heading.component';
import { PostPriceComponent } from './post-price/post-price.component';
import { PostUserInfoComponent } from './post-user-info/post-user-info.component';
import { PostOfferActionsComponent } from './post-offer-actions/post-offer-actions.component';
import { PostBitsComponent } from './post-bits/post-bits.component';
import { AddPostComponent } from './add-post/add-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { CardShimmerComponent } from "../components/card-shimmer/card-shimmer.component";
import { AppFiltersComponent } from "../components/app-filters/app-filters.component";
@NgModule({
  declarations: [
    PostCardComponent,
    PostComponent,
    PostFilterComponent,
    PostCategoryComponent,
    PostDetailComponent,
    PostGalleryComponent,
    SinglePostDetailComponent,
    PostHeadingComponent,
    PostPriceComponent,
    PostUserInfoComponent,
    PostOfferActionsComponent,
    PostBitsComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    ProductCardComponent,
    CardShimmerComponent,
    AppFiltersComponent
],
  exports:[
    PostComponent,
    AddPostComponent
  ]
})
export class PostModule { }
