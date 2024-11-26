import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './components/modals/auth-modal/auth-modal.component';
import { HeaderNavigationComponent } from "./components/header/header.component";
import { LoginModalComponent } from "./pages/login-modal/login-modal.component";
import { TempFormComponent } from './components/temp-form/temp-form.component';
import { BodyComponent } from "./pages/body/body.component";
import { SupportModalComponent } from "./components/modals/support-modal/support-modal.component";


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [BodyComponent, FooterComponent, TempFormComponent, AuthModalComponent, RouterOutlet, CommonModule, HeaderNavigationComponent, LoginModalComponent, BodyComponent, SupportModalComponent]
  // imports: [HeaderComponent,FooterComponent,FooterComponent,RouterOutlet, ChatBoxComponent, ProfilePageComponent, ProductDetailsComponent, SellingComponent, WhoBoughtAdComponent, ReviewPageComponent, HeaderComponent, ,CommonModule]
})
export class AppComponent {
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scrolls to the top
      }
    });
  }
  title = 'tt-offer';
}

