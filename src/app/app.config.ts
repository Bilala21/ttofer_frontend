import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { TokenizedInterceptor } from './shared/services/security/tokenized-Interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

const firebaseConfig = {
  apiKey: "AIzaSyBZft6faojDE1C5Q-UmMnUS7LLAtUIzDJo",
  authDomain: "ttoffer-427813.firebaseapp.com",
  databaseURL: "https://ttoffer-427813-default-rtdb.firebaseio.com",
  projectId: "ttoffer-427813",
  storageBucket: "ttoffer-427813.appspot.com",
  messagingSenderId: "743801656770",
  appId: "1:743801656770:web:7a5216e85f95b36ef4b25b",
  measurementId: "G-MR12N9FCEB"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenizedInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnimationsAsync(),
    BrowserModule,
    GoogleMapsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    provideAnimations(),
    provideToastr(),
  ]
};
