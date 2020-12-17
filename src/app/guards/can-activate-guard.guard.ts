import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuardGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) { }

  canActivate() {
    // If the user is not logged in we'll send them back to the home page
    if (!this.authService.isAutenticated) {
      // console.log('No estás logueado');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

}
