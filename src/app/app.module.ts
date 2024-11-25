import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS,  provideHttpClient, withFetch } from '@angular/common/http';
import { TokenizedInterceptor } from './shared/services/security/tokenized-Interceptor';
import { FooterComponent } from './components/footer/footer.component';





@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    
    // RouterModule.forRoot([{ path: 'pages/profilemodule/transactions/sale-purchase', loadChildren: () => import('./profilemodule/transactions/sale-purchase/sale-purchase.module').then(m => m.SalePurchaseModule) }, 
    // { path: 'pages/profilemodule', loadChildren: () => import('./profilemodule/profilemodule.module').then(m => m.ProfilemoduleModule) }]),
    FooterComponent,
],
  exports: [
    // HeaderComponent
  ],
  providers:[
    provideHttpClient(
      withFetch(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenizedInterceptor, multi: true,
    },
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
