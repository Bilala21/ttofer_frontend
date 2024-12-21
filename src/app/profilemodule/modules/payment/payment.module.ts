import { NgModule } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { TabComponent } from '../purchase-sale/components/tab/tab.component';
import { CardShimmerComponent } from '../../../components/card-shimmer/card-shimmer.component';

const routes: Routes = [{ path: '', component: PaymentComponent }];

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    CommonModule,
    TabComponent,
    CardShimmerComponent,
    RouterModule.forChild(routes),
  ],
})
export class PaymentModule {}
