import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLinkComponent } from './components/custom-link/custom-link.component';

const routes: Routes = [{ path: '', component: CustomLinkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomLinkRoutingModule {}




