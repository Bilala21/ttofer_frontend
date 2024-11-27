import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseSaleComponent } from './components/purchase-sale/purchase-sale.component';

const routes: Routes = [
  {path:'',component:PurchaseSaleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseSaleRoutingModule { }
