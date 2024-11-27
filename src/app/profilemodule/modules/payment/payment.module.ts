import { NgModule } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { TabComponent } from '../purchase-sale/components/tab/tab.component';

const routes: Routes = [{ path: '', component: PaymentComponent }];

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    CommonModule,
    TabComponent,
    RouterModule.forChild(routes),
  ],
})
export class PaymentModule {}
