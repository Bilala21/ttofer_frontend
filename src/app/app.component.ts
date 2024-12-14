import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderNavigationComponent } from './components/header/header.component';
import { SupportModalComponent } from "./components/modals/support-modal/support-modal.component";
import { AuthService } from './shared/services/authentication/Auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    FooterComponent,
    RouterOutlet,
    CommonModule,
    HeaderNavigationComponent,
    SupportModalComponent
],
})
export class AppComponent {
  constructor(private router: Router,private authservice:AuthService) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  }

  title = 'tt-offer';
}
