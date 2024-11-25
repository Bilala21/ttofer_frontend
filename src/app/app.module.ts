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
    
    RouterModule.forRoot([]),
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
