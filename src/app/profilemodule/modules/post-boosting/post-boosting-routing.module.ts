import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostBoostingComponent } from './components/post-boosting/post-boosting.component';

const routes: Routes = [{ path: '', component: PostBoostingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostBoostingRoutingModule {}
