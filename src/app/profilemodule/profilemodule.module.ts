import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfilemoduleComponent } from './profilemodule.component';
import { ProfileSidebarComponent } from './modules/profile-sidebar/profile-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilemoduleComponent,
    children: [
      {
        path: '',
        redirectTo: 'sale-purchase',
        pathMatch: 'full',
      },
      {
        path: 'sale-purchase',
        loadChildren: () =>
          import('./modules/purchase-sale/purchase-sale.module').then(
            (m) => m.PurchaseSaleModule
          ),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./modules/payment/payment.module').then(
            (m) => m.PaymentModule
          ),
      },
      {
        path: 'help-center',
        loadChildren: () =>
          import('./modules/help-center/help-center.module').then(
            (m) => m.HelpCenterModule
          ),
      },
      {
        path: 'custom-link',
        loadChildren: () =>
          import('./modules/custom-link/custom-link.module').then(
            (m) => m.CustomLinkModule
          ),
      },
      {
        path: 'account-setting',
        loadChildren: () =>
          import('./modules/account-settings/account-settings.module').then(
            (m) => m.AccountSettingsModule
          ),
      },
      {
        path: 'post-boosting',
        loadChildren: () =>
          import('./modules/post-boosting/post-boosting.module').then(
            (m) => m.PostBoostingModule
          ),
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('./modules/wallet/wallet-routing.module').then(
            (m) => m.WalletRoutingModule
          ),
      },
      {
        path: 'saved-items',
        loadChildren: () =>
          import('./modules/saved-items/saved-items.module').then(
            (m) => m.SavedItemsModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./modules/notifications/notifications-routing.module').then(
            (m) => m.NotificationsRoutingModule
          ),
      },
      {
        path: 'add-post',
        loadChildren: () =>
          import('./modules/my-posts/my-posts.module').then(
            (m) => m.MyPostsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [ProfilemoduleComponent],
  imports: [
    CommonModule,
    ProfileSidebarComponent,
    RouterModule.forChild(routes),
  ],
})
export class ProfilemoduleModule {}
