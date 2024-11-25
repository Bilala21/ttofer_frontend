import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfilemoduleComponent } from './profilemodule.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';

const routes: Routes = [{ path: '', component: ProfilemoduleComponent }];

@NgModule({
  declarations: [ProfilemoduleComponent],
  imports: [
    CommonModule,
    ProfileSidebarComponent,
    RouterModule.forChild(routes),
  ],
})
export class ProfilemoduleModule {}
