import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UniversalRouteActivatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    const { isAuthenticated } = this.authService;
    const token = this.cookieService.get('tembea_token');
    const helper = new JwtHelperService();
    const isTokenExpired = helper.isTokenExpired(token);

    if (!isAuthenticated && token && !isTokenExpired) {
      try {
        const decoded = helper.decodeToken(token);
        this.authService.setCurrentUser(decoded.userInfo);
        this.authService.tembeaToken = token;
        this.authService.setupClock();
        this.authService.isAuthenticated = true;
        this.authService.isAuthorized = true;
      } catch (err) {
        return this.redirectHome();
      }
    }

    this.deleteTokenIfExpired(isTokenExpired);

    return this.authService.isAuthenticated && !isTokenExpired
      ? true
      : this.redirectHome();
  }

  deleteTokenIfExpired(isTokenExpired: boolean) {
    if (isTokenExpired) {
      this.cookieService.delete('tembea_token');
    }
  }

  redirectHome(): boolean {
    this.router.navigate(['/']);
    return false;
  }
}
