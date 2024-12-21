import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedItemsComponent } from './components/saved-items/saved-items.component';

const routes: Routes = [{path:'', component:SavedItemsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedItemsRoutingModule { }
