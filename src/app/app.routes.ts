import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './pages/body/body.component';
import { ProductViewsComponent } from './pages/product-views/product-views.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ChatBoxComponent } from './pages/chat-box/chat-box.component';
import { WhoBoughtAdComponent } from './pages/who-bought-ad/who-bought-ad.component';
import { ReviewPageComponent } from './pages/review-page/review-page.component';
import { AuctionUserProfileComponent } from './pages/auction-user-profile/auction-user-profile.component';
import { PrivacyPolicyComponent } from './pages/Privacy-Policy/Privacy-Policy.component';
import { TermOfConditionComponent } from './pages/term-of-condition/term-of-condition.component';
import { MarkAsSoldComponent } from './pages/mark-as-sold/mark-as-sold.component';
import { SellingDetailComponent } from './pages/selling/detail/selling-detail.component';
import { SellingComponent } from './pages/selling/selling.component';
import { PostPerformanceComponent } from './pages/selling/post-performance/post-performance.component';
import { DeleteAccountPageComponent } from './pages/profile-page/delete-account/delete-account.component';
import { ProductBuyerComponent } from './pages/selling/buyer/product-buyer.component';
import { SellerReveiwComponent } from './pages/selling/reviews/seller-reveiw.component';
import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CheckOutPageComponent } from './pages/check-out-page/check-out-page.component';
import { FAQComponent } from './pages/f-a-q/f-a-q.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [


    {
        path: '',
        component: BodyComponent,
        pathMatch: 'full'
    },

    {
        path: 'product-detail/:id/:slug',
        component: ProductDetailComponent
        // component: ProductDetailsComponent
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'profilePage/:id',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user/delete-account/:id',
        component: DeleteAccountPageComponent
    },
    {
        path: 'profilePageBy/:id/:slug',
        component: ProfilePageComponent
    },
    {
        path: 'category/:slug',
        component: CategoriesComponent
    },
    {
        path: 'chatBox/:id',
        component: ChatBoxComponent
    },
    {
        path: 'selling/:id',
        component: SellingComponent
    },
    {
        path: 'selling-detail/:id',
        component: SellingDetailComponent
    },
    {
        path: 'product-buyer',
        component: ProductBuyerComponent
    },
    {
        path: 'seller-review/:id',
        component: SellerReveiwComponent
    },
    {
        path: 'post-performance',
        component: PostPerformanceComponent
    },
    {
        path: 'whoBoughtAd/:id',
        component: WhoBoughtAdComponent
    },
    {
        path: 'review/:id',
        component: ReviewPageComponent
    },
    {
        path: 'userProfile/:id',
        component: AuctionUserProfileComponent
    },
    {
        path: 'product-views/:id',
        component: ProductViewsComponent
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'term-of-condition',
        component: TermOfConditionComponent
    },
    {
        path: 'markAsSold/:id',
        component: MarkAsSoldComponent
    },
    {
        path: 'cart',
        component: ShoppingCartComponent
    },
    {
        path: 'checkout',
        component: CheckOutPageComponent
    },
    {
        path: 'contact-us',
        component: ContactFormComponent
    },
    {
        path: 'about-us',
        component: AboutUsComponent
    },
    {
        path: 'faq',
        component: FAQComponent
    },
    {
        path: 'auth',
        component: AuthModalComponent
    },
    // {
    //     path: 'post',
    //     loadChildren: () => import('./post/post.module').then(m => m.PostModule)
    // },
    // {
    //     path: 'profile',
    //     loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
    // },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
