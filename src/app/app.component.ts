import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/shared-components/header/header.component";
import { FooterComponent } from "./shared/shared-components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './components/modals/auth-modal/auth-modal.component';
import { HeaderNavigationComponent } from "./components/header/header.component";
import { LoginModalComponent } from "./pages/login-modal/login-modal.component";
import { TempFormComponent } from './components/temp-form/temp-form.component';
import { BodyComponent } from "./pages/body/body.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BodyComponent,HeaderComponent, FooterComponent, TempFormComponent, AuthModalComponent, RouterOutlet, CommonModule, HeaderNavigationComponent, LoginModalComponent, BodyComponent]
    // imports: [HeaderComponent,FooterComponent,FooterComponent,RouterOutlet, ChatBoxComponent, ProfilePageComponent, ProductDetailsComponent, SellingComponent, WhoBoughtAdComponent, ReviewPageComponent, HeaderComponent, ,CommonModule]
})
export class AppComponent {
  title = 'tt-offer';
}

