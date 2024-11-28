import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';

const routes: Routes = [{ path: '', component: WalletDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {
}
