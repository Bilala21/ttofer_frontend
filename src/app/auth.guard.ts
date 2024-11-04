import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GlobalStateService } from './shared/services/state/global-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authState: GlobalStateService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.getToken();

    if (token) {
      return true;
    } else {
      // Redirect to home and show modal
      this.router.navigate(['/']).then(() => {
        this.authState.showAuthModal(true);
      });
      return false;
    }
  }

  private getToken(): string | null {
    return localStorage.getItem("authToken");
  }
}
